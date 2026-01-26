from django.core.management.base import BaseCommand
from social.models import Community
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Seeds initial social data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding social data...')

        # Ensure admin user exists for authoring if none
        if not User.objects.exists():
             User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
             self.stdout.write('Admin user created')

        # Communities
        communities = [
            {'name': 'General Space', 'slug': 'general', 'description': 'Talk about anything space related.', 'icon': ''},
            {'name': 'Rocketry', 'slug': 'rocketry', 'description': 'For the rocket engineers.', 'icon': ''},
            {'name': 'Astrophysics', 'slug': 'astrophysics', 'description': 'Deep space discussions.', 'icon': ''},
            {'name': 'Mars Colonization', 'slug': 'mars', 'description': 'Plans for the red planet.', 'icon': ''},
        ]

        for data in communities:
            Community.objects.get_or_create(slug=data['slug'], defaults=data)
        
        self.stdout.write('Communities seeded.')
