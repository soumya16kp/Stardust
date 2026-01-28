from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.contrib.auth.models import User

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('astronomy', 'Astronomical Event'),
        ('launch', 'Space Launch'),
        ('industry', 'Space Industry'),
        ('community', 'Community & Education'),
        ('webinar', 'Webinar/Workshop'),
    ]

    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    EQUIPMENT_CHOICES = [
        ('naked_eye', 'Naked Eye'),
        ('binoculars', 'Binoculars'),
        ('telescope', 'Telescope'),
        ('none', 'None Required'),
    ]

    # Core Info
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='astronomy')
    
    # Timing
    date_time = models.DateTimeField(default=timezone.now, help_text="Event Start Time")
    end_time = models.DateTimeField(null=True, blank=True, help_text="Event End Time (optional)")
    timezone = models.CharField(max_length=50, default='UTC', help_text="e.g. UTC, Asia/Kolkata")
    
    # Location / Accessibility
    region = models.CharField(max_length=100, default='Global', help_text="Visibility region or 'Global'")
    is_live = models.BooleanField(default=False, help_text="Is this a live event (webinar/livestream)?")
    
    # Quick View Info
    short_description = models.TextField(help_text="1-2 lines for the card", default="Upcoming event")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    
    # Detailed Info
    full_description = models.TextField(blank=True, help_text="Detailed overview")
    scientific_explanation = models.TextField(blank=True, help_text="Simple scientific explanation")
    
    # Specifics: Launch
    rocket_name = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Falcon 9")
    mission_name = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Starlink 12")
    agency = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. SpaceX, NASA, ISRO")
    launch_details = models.TextField(blank=True, help_text="Specific details about the launch sequence")
    
    # Specifics: Astronomy
    equipment_needed = models.CharField(max_length=20, choices=EQUIPMENT_CHOICES, default='none', blank=True)
    viewing_guide = models.TextField(blank=True, help_text="Best time, direction, tips")
    
    # Links & Media
    image_url = models.URLField(blank=True, null=True)
    external_link = models.URLField(blank=True, help_text="Livestream or registration link")
    
    # Community
    attendees = models.ManyToManyField(User, related_name='attending_events', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title) + '-' + timezone.now().strftime('%Y%m%d')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"

class Program(models.Model):
    CATEGORY_CHOICES = [
        ('Fundamentals', 'Fundamentals'),
        ('Robotics', 'Robotics'),
        ('Physics', 'Physics'),
        ('Career', 'Career'),
    ]
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class EventComment(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username} on {self.event.title}"
