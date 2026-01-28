from rest_framework import serializers
from .models import Community, Post, Comment, CommunityMember, Message, Report, Notification, Poll, PollOption, PollVote

class CommunitySerializer(serializers.ModelSerializer):
    creator_username = serializers.ReadOnlyField(source='creator.username')
    is_member = serializers.SerializerMethodField()
    membership_status = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    is_banned = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'slug', 'description', 'icon', 'privacy', 'creator', 'creator_username', 'created_at', 'is_member', 'membership_status', 'role', 'is_banned']
        read_only_fields = ['creator']

    def get_is_member(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return CommunityMember.objects.filter(community=obj, user=user, status='accepted').exists()
        return False

    def get_membership_status(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            try:
                member = CommunityMember.objects.get(community=obj, user=user)
                return member.status
            except CommunityMember.DoesNotExist:
                return None
        return None

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

from accounts.serializers import ProfileSerializer



class PollOptionSerializer(serializers.ModelSerializer):
    votes_count = serializers.ReadOnlyField()
    is_voted = serializers.SerializerMethodField()

    class Meta:
        model = PollOption
        fields = ['id', 'text', 'votes_count', 'is_voted']

    def get_is_voted(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.votes.filter(user=user).exists()
        return False

class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)
    total_votes = serializers.SerializerMethodField()
    user_voted_option = serializers.SerializerMethodField()

    class Meta:
        model = Poll
        fields = ['id', 'question', 'options', 'total_votes', 'user_voted_option', 'is_active', 'created_at']

    def get_total_votes(self, obj):
        return obj.votes.count()

    def get_user_voted_option(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            try:
                vote = obj.votes.get(user=user)
                return vote.option.id
            except PollVote.DoesNotExist:
                return None
        return None

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    author_profile = ProfileSerializer(source='author.profile', read_only=True)
    community_name = serializers.ReadOnlyField(source='community.name')
    likes_count = serializers.ReadOnlyField()
    comments_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()
    
    poll = PollSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_username', 'author_profile', 'community', 'community_name', 
                  'content', 'image', 'video', 'document', 'poll', 
                  'likes_count', 'comments_count', 'is_liked', 'is_author', 'created_at']
        read_only_fields = ['author']

    def get_is_liked(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False

    def get_is_author(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.author == user
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
