from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.utils import timezone

class Program(models.Model):
    TYPE_CHOICES = [
        ('mission', 'Mission (Course)'),
        ('webinar', 'Webinar (Live Ops)'),
        ('hackathon', 'Hackathon (Arena)'),
    ]
    
    LEVEL_CHOICES = [
        ('cadet', 'Cadet (Beginner)'),
        ('explorer', 'Explorer (Intermediate)'),
        ('astronaut', 'Astronaut (Advanced)'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField(help_text="Mission Briefing")
    program_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='mission')
    difficulty = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='cadet')
    
    # Metadata
    instructor = models.CharField(max_length=100, help_text="Mission Commander / Speaker")
    instructor_bio = models.TextField(blank=True, help_text="Brief bio of the commander")
    instructor_image_url = models.URLField(blank=True, null=True, help_text="Avatar URL for the commander")
    duration = models.CharField(max_length=50, help_text="e.g. '4 Weeks' or '2 Hours'")
    start_date = models.DateTimeField(default=timezone.now)
    is_live = models.BooleanField(default=False)
    image_url = models.URLField(blank=True, null=True)
    
    # Validation/Gamification
    xp_reward = models.IntegerField(default=100, help_text="XP for completion")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title) + '-' + timezone.now().strftime('%Y%m%d')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.get_program_type_display()}] {self.title}"

class Module(models.Model):
    """Sections within a Mission (e.g., 'Phase 1: Orbital Mechanics')"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.program.title} - {self.title}"

class Session(models.Model):
    """Content within a Module (Video, Quiz, Text)"""
    TYPE_CHOICES = [
        ('video', 'Video Transmission'),
        ('text', 'Mission Log'),
        ('quiz', 'Simulation Check'),
    ]
    
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=200)
    session_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='text')
    content = models.TextField(help_text="Text content or Video URL")
    order = models.PositiveIntegerField(default=0)
    duration = models.IntegerField(help_text="Estimated minutes", default=10)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('completed', 'Mission Accomplished'),
        ('dropped', 'Aborted'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='program_enrollments')
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='students')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')
    progress = models.IntegerField(default=0, help_text="Percentage completed")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'program')

    def __str__(self):
        return f"{self.user.username} -> {self.program.title}"

# --- Specific Models for Different Tracks ---

class WebinarDetails(models.Model):
    program = models.OneToOneField(Program, on_delete=models.CASCADE, related_name='webinar_details')
    meeting_link = models.URLField(blank=True)
    recording_link = models.URLField(blank=True)
    speakers = models.TextField(help_text="List of speakers/bios")

class HackathonTeam(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='teams')
    name = models.CharField(max_length=100)
    leader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='led_teams')
    members = models.ManyToManyField(User, related_name='hackathon_teams')
    project_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
