from rest_framework import serializers
from .models import Program, Module, Session, Enrollment, WebinarDetails, HackathonTeam

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'title', 'session_type', 'content', 'order', 'duration']

class ModuleSerializer(serializers.ModelSerializer):
    sessions = SessionSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'sessions']

class WebinarDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebinarDetails
        fields = ['meeting_link', 'recording_link', 'speakers']

class HackathonTeamSerializer(serializers.ModelSerializer):
    leader_username = serializers.ReadOnlyField(source='leader.username')
    
    class Meta:
        model = HackathonTeam
        fields = ['id', 'name', 'leader', 'leader_username', 'members', 'project_link', 'created_at']

class ProgramSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    webinar_details = WebinarDetailsSerializer(read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    team_info = serializers.SerializerMethodField()

    class Meta:
        model = Program
        fields = [
            'id', 'title', 'slug', 'description', 'program_type', 'difficulty',
            'instructor', 'duration', 'start_date', 'is_live', 'image_url', 'xp_reward',
            'modules', 'webinar_details', 'is_enrolled', 'progress', 'team_info', 'created_at'
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.students.filter(user=request.user).exists()
        return False

    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = obj.students.get(user=request.user)
                return enrollment.progress
            except Enrollment.DoesNotExist:
                return 0
        return 0

    def get_team_info(self, obj):
        # Only for hackathons
        if obj.program_type != 'hackathon':
            return None
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Check if user is in any team for this program
            team = obj.teams.filter(members=request.user).first()
            if team:
                return HackathonTeamSerializer(team).data
        return None

class EnrollmentSerializer(serializers.ModelSerializer):
    program_title = serializers.ReadOnlyField(source='program.title')
    program_slug = serializers.ReadOnlyField(source='program.slug')

    class Meta:
        model = Enrollment
        fields = ['id', 'program', 'program_title', 'program_slug', 'status', 'progress', 'enrolled_at', 'completed_at']
        read_only_fields = ['status', 'progress', 'enrolled_at', 'completed_at']
