from django.core.management.base import BaseCommand
from django.utils import timezone
from content.models import Event
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with sample events'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding events...')
        
        # Clear existing events
        Event.objects.all().delete()

        now = timezone.now()

        events = [
            {
                'title': 'Starship IFT-4 Orbital Test',
                'short_description': 'SpaceX to attempt the fourth integrated flight test of Starship from Starbase, Texas.',
                'full_description': 'The fourth flight test of Starship/Super Heavy. Primary goals include successful stage separation, Starship reaching orbital velocity, and controlled reentry of both stages.',
                'category': 'launch',
                'date_time': now + timedelta(days=2),
                'end_time': now + timedelta(days=2, hours=4),
                'region': 'USA',
                'rocket_name': 'Starship',
                'mission_name': 'IFT-4',
                'agency': 'SpaceX',
                'image_url': 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop',
                'launch_details': 'Liftoff targeted for 08:00 CT. Pad 39A preparations are underway. Weather is 80% favorable.',
                'is_live': False
            },
            {
                'title': 'Perseid Meteor Shower Peak',
                'short_description': 'The most popular meteor shower of the year peaks tonight with up to 100 meteors per hour.',
                'full_description': 'The Perseids are prolific, causing plenty of meteors to be seen. They are associated with the comet Swift-Tuttle. Best viewing is from midnight to dawn.',
                'category': 'astronomy',
                'date_time': now + timedelta(days=5, hours=22),
                'end_time': now + timedelta(days=6, hours=4),
                'region': 'Global',
                'scientific_explanation': 'Meteor showers occur when Earth passes through debris trails left by comets. The Perseids are debris from Comet Swift-Tuttle.',
                'viewing_guide': 'Find a dark sky location away from city lights. Lie flat on your back and look up. Limit phone use to adjust your eyes to the dark.',
                'equipment_needed': 'naked_eye',
                'image_url': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop',
                'is_live': False
            },
            {
                'title': 'James Webb Deep Field Analysis',
                'short_description': 'Live webinar discussing the latest deep field images from JWST.',
                'category': 'industry',
                'date_time': now + timedelta(hours=1),
                'end_time': now + timedelta(hours=3),
                'region': 'Online',
                'is_live': True,
                'external_link': 'https://nasa.gov/webb',
                'image_url': 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=2007&auto=format&fit=crop'
            },
             {
                'title': 'Falcon 9 Starlink Launch',
                'short_description': 'SpaceX Falcon 9 launching a new batch of Starlink satellites.',
                'category': 'launch',
                'date_time': now - timedelta(hours=5), # Past event
                'end_time': now - timedelta(hours=4),
                'region': 'USA',
                'rocket_name': 'Falcon 9',
                'mission_name': 'Starlink Group 7-1',
                'agency': 'SpaceX',
                'is_live': False
            }
        ]

        for event_data in events:
            Event.objects.create(**event_data)
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded events'))
