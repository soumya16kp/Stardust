from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Program, Enrollment, Module
from .serializers import ProgramSerializer, EnrollmentSerializer, ModuleSerializer

class ProgramViewSet(viewsets.ModelViewSet):
    """
    API for Programs (Missions, Webinars, Hackathons)
    """
    queryset = Program.objects.all().order_by('-created_at')
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'instructor']
    
    def get_queryset(self):
        queryset = Program.objects.all()
        program_type = self.request.query_params.get('type', None)
        if program_type:
            queryset = queryset.filter(program_type=program_type)
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        program = self.get_object()
        user = request.user
        
        if Enrollment.objects.filter(user=user, program=program).exists():
            return Response({'detail': 'Already enrolled'}, status=status.HTTP_400_BAD_REQUEST)
        
        enrollment = Enrollment.objects.create(user=user, program=program)
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for User's Enrollments
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user).order_by('-enrolled_at')

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        enrollment = self.get_object()
        progress = request.data.get('progress')
        
        if progress is not None:
            enrollment.progress = min(max(int(progress), 0), 100)
            if enrollment.progress == 100:
                enrollment.status = 'completed'
                # Here we could trigger badge logic
            enrollment.save()
            return Response(self.get_serializer(enrollment).data)
        return Response({'detail': 'Progress value required'}, status=status.HTTP_400_BAD_REQUEST)
