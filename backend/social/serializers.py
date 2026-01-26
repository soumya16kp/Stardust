from rest_framework import serializers
from .models import Community, Post, Comment, CommunityMember, Message, Report, Notification

class CommunitySerializer(serializers.ModelSerializer):
    creator_username = serializers.ReadOnlyField(source='creator.username')
    is_member = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    is_banned = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'slug', 'description', 'icon', 'privacy', 'creator', 'creator_username', 'created_at', 'is_member', 'role', 'is_banned']
        read_only_fields = ['creator']

    def get_is_member(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return CommunityMember.objects.filter(community=obj, user=user, status='accepted').exists()
        return False

    def get_role(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            try:
                member = CommunityMember.objects.get(community=obj, user=user)
                return member.role
            except CommunityMember.DoesNotExist:
                return None
        return None
    
    def get_is_banned(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.banned_users.filter(id=user.id).exists()
        return False

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_username', 'post', 'content', 'created_at']
        read_only_fields = ['author']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    community_name = serializers.ReadOnlyField(source='community.name')
    likes_count = serializers.ReadOnlyField()
    comments_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_username', 'community', 'community_name', 
                  'content', 'image', 'video', 'likes_count', 'comments_count', 'is_liked', 'created_at']
        read_only_fields = ['author']

    def get_is_liked(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_username', 'receiver', 'receiver_username', 'content', 'timestamp']
        read_only_fields = ['sender', 'timestamp']

class ReportSerializer(serializers.ModelSerializer):
    reporter_username = serializers.ReadOnlyField(source='reporter.username')
    
    class Meta:
        model = Report
        fields = ['id', 'reporter', 'reporter_username', 'community', 'post', 'comment', 'reported_user', 'reason', 'is_resolved', 'created_at']
        read_only_fields = ['reporter', 'is_resolved']

class NotificationSerializer(serializers.ModelSerializer):
    actor_username = serializers.ReadOnlyField(source='actor.username')
    
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'type', 'actor', 'actor_username', 'content', 'related_link', 'is_read', 'created_at']
        read_only_fields = ['recipient', 'actor', 'content', 'related_link']
