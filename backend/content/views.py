from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import Event, Program, EventComment
from .serializers import EventSerializer, ProgramSerializer, EventCommentSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by('date_time')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(rocket_name__icontains=search) |
                Q(agency__icontains=search)
            )

        # Filters
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category=category)

        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__iexact=region)

        # Date Filtering
        time_filter = self.request.query_params.get('time', 'upcoming')
        now = timezone.now()
        if time_filter == 'upcoming':
            queryset = queryset.filter(date_time__gte=now)
        elif time_filter == 'past':
            queryset = queryset.filter(date_time__lt=now)
        elif time_filter == 'live':
            queryset = queryset.filter(is_live=True, date_time__lte=now, end_time__gte=now)

        return queryset

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def attend(self, request, slug=None):
        event = self.get_object()
        user = request.user
        if event.attendees.filter(id=user.id).exists():
            event.attendees.remove(user)
            return Response({'status': 'removed', 'count': event.attendees.count()})
        else:
            event.attendees.add(user)
            return Response({'status': 'added', 'count': event.attendees.count()})

    @decorators.action(detail=True, methods=['get'])
    def comments(self, request, slug=None):
        event = self.get_object()
        comments = event.comments.all().order_by('-created_at')
        serializer = EventCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, slug=None):
        event = self.get_object()
        serializer = EventCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, event=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.AllowAny]
