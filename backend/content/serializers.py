from rest_framework import serializers
from .models import Event, Program, EventComment

class EventSerializer(serializers.ModelSerializer):
    attendees_count = serializers.SerializerMethodField()
    is_attending = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'category', 
            'date_time', 'end_time', 'timezone', 
            'region', 'is_live', 
            'short_description', 'difficulty',
            'full_description', 'scientific_explanation',
            'rocket_name', 'mission_name', 'agency',
            'equipment_needed', 'viewing_guide',
            'image_url', 'external_link',
            'attendees_count', 'is_attending',
            'created_at'
        ]

    def get_attendees_count(self, obj):
        return obj.attendees.count()

    def get_is_attending(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.attendees.filter(id=request.user.id).exists()
        return False

class EventCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    author_avatar = serializers.SerializerMethodField()

    class Meta:
        model = EventComment
        fields = ['id', 'event', 'author', 'author_username', 'author_avatar', 'content', 'created_at']
        read_only_fields = ['author', 'event']

    def get_author_avatar(self, obj):
        if hasattr(obj.author, 'profile') and obj.author.profile.avatar:
            return obj.author.profile.avatar.url
        return None

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'
