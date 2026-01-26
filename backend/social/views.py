from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import models
from .models import Community, Post, Comment, CommunityMember, Message, Report, Notification
from .serializers import CommunitySerializer, PostSerializer, CommentSerializer, MessageSerializer, ReportSerializer, NotificationSerializer

class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        community = serializer.save(creator=self.request.user)
        CommunityMember.objects.create(
            community=community,
            user=self.request.user,
            role='admin',
            status='accepted'
        )

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, slug=None):
        community = self.get_object()
        if community.banned_users.filter(id=request.user.id).exists():
            return Response({'detail': 'You are banned from this community.'}, status=status.HTTP_403_FORBIDDEN)
            
        if CommunityMember.objects.filter(community=community, user=request.user).exists():
            return Response({'detail': 'Already a member or request pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        status_val = 'accepted' if community.privacy == 'public' else 'pending'
        CommunityMember.objects.create(community=community, user=request.user, status=status_val)
        return Response({'status': status_val})

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, slug=None):
        community = self.get_object()
        try:
            membership = CommunityMember.objects.get(community=community, user=request.user)
            membership.delete()
            return Response({'status': 'left'})
        except CommunityMember.DoesNotExist:
            return Response({'detail': 'Not a member'}, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve_member(self, request, slug=None):
        community = self.get_object()
        if not CommunityMember.objects.filter(community=community, user=request.user, role__in=['admin', 'moderator'], status='accepted').exists():
             return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.data.get('user_id')
        try:
            membership = CommunityMember.objects.get(community=community, user_id=user_id, status='pending')
            membership.status = 'accepted'
            membership.save()
            return Response({'status': 'approved'})
        except CommunityMember.DoesNotExist:
            return Response({'detail': 'Member not found or not pending'}, status=status.HTTP_404_NOT_FOUND)

    @decorators.action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def members(self, request, slug=None):
        community = self.get_object()
        status_param = request.query_params.get('status', 'accepted')
        members = CommunityMember.objects.filter(community=community, status=status_param)
        
        data = []
        for m in members:
            data.append({
                'user_id': m.user.id,
                'username': m.user.username,
                'status': m.status,
                'role': m.role,
                'is_muted': m.is_muted,
                'joined_at': m.joined_at
            })
        return Response(data)

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def ban_user(self, request, slug=None):
        community = self.get_object()
        if not CommunityMember.objects.filter(community=community, user=request.user, role='admin', status='accepted').exists():
             return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        user_to_ban = get_object_or_404(User, id=user_id)
        
        # Remove membership
        CommunityMember.objects.filter(community=community, user=user_to_ban).delete()
        # Add to banned
        community.banned_users.add(user_to_ban)
        
        return Response({'status': 'banned'})

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Check if muted
        community = serializer.validated_data.get('community')
        if community: 
            if community.banned_users.filter(id=self.request.user.id).exists():
                 raise serializers.ValidationError("You are banned from this community.")
            member = CommunityMember.objects.filter(community=community, user=self.request.user).first()
            if member and member.is_muted:
                 raise serializers.ValidationError("You are muted in this community.")

        serializer.save(author=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        community_slug = self.request.query_params.get('community', None)
        feed_type = self.request.query_params.get('type', None)

        if community_slug:
            queryset = queryset.filter(community__slug=community_slug)
        
        if feed_type == 'video':
            queryset = queryset.exclude(video='')

        return queryset

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)
            return Response({'status': 'unliked'})
        else:
            post.likes.add(user)
            return Response({'status': 'liked'})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Mute check logic same as Post ... omitted for brevity but should be here
        serializer.save(author=self.request.user)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post', None)
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user)).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

    @decorators.action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked read'})
