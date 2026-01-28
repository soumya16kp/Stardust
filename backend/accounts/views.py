from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.permissions import AllowAny

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data['password'])
        user.save()

class ActiveUserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users active in last 15 minutes
        time_threshold = timezone.now() - timedelta(minutes=15)
        queryset = User.objects.filter(profile__last_activity__gte=time_threshold).order_by('-profile__last_activity')
        
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(username__icontains=search_query)
        
        return queryset

    @action(detail=False, methods=['get'], url_path='by_username/(?P<username>[^/.]+)')
    def get_by_username(self, request, username=None):
        user = generics.get_object_or_404(User, username=username)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'patch', 'put'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        elif request.method in ['PATCH', 'PUT']:
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)

    @action(detail=False, methods=['get'])
    def all_users(self, request):
        # Endpoint to search across ALL users, not just active ones
        search_query = request.query_params.get('search', '')
        if not search_query:
            return Response([])
        
        users = User.objects.filter(username__icontains=search_query)[:20]
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
