from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommunityViewSet, PostViewSet, CommentViewSet, MessageViewSet, ReportViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'communities', CommunityViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'reports', ReportViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
