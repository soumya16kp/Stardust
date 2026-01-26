from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ProgramViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'programs', ProgramViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
