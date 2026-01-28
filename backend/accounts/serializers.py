from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    is_online = serializers.ReadOnlyField()
    
    class Meta:
        model = Profile
        fields = ['avatar', 'bio', 'is_online', 'last_activity']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        # Update User fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        
        # Update Profile fields
        if profile_data:
            profile = instance.profile
            profile.bio = profile_data.get('bio', profile.bio)
            if 'avatar' in profile_data:
                profile.avatar = profile_data['avatar']
            profile.save()
            
        return instance
