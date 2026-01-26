from django.core.management.base import BaseCommand
from content.models import Event, Program
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Seeds the database with initial events and programs'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # Events
        if not Event.objects.exists():
            Event.objects.create(
                title='Star Gazing Night',
                description='Join us for a night under the stars.',
                date=date.today() + timedelta(days=10),
                location='Online'
            )
            Event.objects.create(
                title='Mars Settlement',
                description='Discussing the future of Mars colonization.',
                date=date.today() + timedelta(days=25),
                location='New York'
            )
            self.stdout.write('Events created.')
        else:
            self.stdout.write('Events already exist.')

        # Programs
        if not Program.objects.exists():
            Program.objects.create(
                title='Rocket Science 101',
                category='Fundamentals',
                level='Beginner'
            )
            Program.objects.create(
                title='Mars Rover Programming',
                category='Robotics',
                level='Intermediate'
            )
            Program.objects.create(
                title='Black Hole Physics',
                category='Physics',
                level='Advanced'
            )
            Program.objects.create(
                title='Zero-G Engineering',
                category='Career',
                level='Advanced'
            )
            self.stdout.write('Programs created.')
        else:
            self.stdout.write('Programs already exist.')
