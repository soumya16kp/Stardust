from django.utils import timezone
from .models import Profile

class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # Update last_activity efficiently
            # We use update() to avoid triggering signals/save method overhead if not needed,
            # but since we might want signals for other things, let's keep it simple for now or use save().
            # Profile might not exist if created before signal signal logic was added, so handling that.
            try:
                profile = request.user.profile
            except Profile.DoesNotExist:
                profile = Profile.objects.create(user=request.user)
            
            # Only update if more than 1 minute has passed to reduce DB writes
            if (timezone.now() - profile.last_activity).total_seconds() > 60:
                profile.last_activity = timezone.now()
                profile.save(update_fields=['last_activity'])

        response = self.get_response(request)
        return response
