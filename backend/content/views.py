from rest_framework import viewsets
from .models import Event, Program
from .serializers import EventSerializer, ProgramSerializer
from rest_framework.permissions import AllowAny

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]
