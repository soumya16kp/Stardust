
import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'space_backend.settings')
django.setup()

from content.models import Event

def populate():
    print("Deleting old events...")
    Event.objects.all().delete()

    events_data = [
        {
            "title": "Perseid Meteor Shower",
            "category": "astronomy",
            "date_time": timezone.now() + timedelta(days=5, hours=20),
            "region": "Global (Best in Northern Hemisphere)",
            "short_description": "The most popular meteor shower of the year, peaking with up to 100 meteors per hour.",
            "difficulty": "beginner",
            "full_description": "The Perseids are prolific, capable of producing 50 to 100 meteors per hour in a dark sky. They are known for their fireballs. The shower runs annually from mid-July to late August.",
            "scientific_explanation": "These meteors are debris from the Comet Swift-Tuttle. As Earth passes through the dust trails left by the comet, the particles burn up in our atmosphere.",
            "viewing_guide": "Best viewed after midnight. Look towards the constellation Perseus, but meteors can appear anywhere. No equipment needed, just your eyes.",
            "image_url": "https://images.unsplash.com/photo-1543167107-160a2b0c3609?q=80&w=1000&auto=format&fit=crop"
        },
        {
            "title": "Starship Flight 7 Test",
            "category": "launch",
            "date_time": timezone.now() + timedelta(days=12, hours=14),
            "region": "Boca Chica, Texas / Global Stream",
            "short_description": "Next major orbital flight test of the Starship Super Heavy booster.",
            "difficulty": "intermediate",
            "full_description": "SpaceX continues its rapid iteration of the Starship system. This flight aims to demonstrate orbital insertion and re-entry thermal protection.",
            "launch_details": "Window: 8:00 AM - 12:00 PM CDT. Vehicle: Starship S31 & Booster B14.",
            "external_link": "https://www.spacex.com/launches",
            "image_url": "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop"
        },
        {
            "title": "Global Space Summit 2026",
            "category": "industry",
            "date_time": timezone.now() + timedelta(days=25, hours=9),
            "region": "London, UK / Online",
            "short_description": "Leading conference for space propulsion and sustainability.",
            "difficulty": "advanced",
            "full_description": "A gathering of industry leaders, engineers, and policymakers to discuss the future of the orbital economy and debris mitigation.",
            "external_link": "https://example.com/summit",
        },
        {
            "title": "Local Stargazing Night",
            "category": "community",
            "date_time": timezone.now() + timedelta(days=2, hours=19),
            "region": "City Park Observatory",
            "short_description": "Join the local astronomy club for a night of telescope viewing.",
            "difficulty": "beginner",
            "viewing_guide": "Bring warm clothes. Telescopes provided.",
            "full_description": "We will be focusing on Jupiter and the Moon. Great for families and beginners.",
        }
    ]

    for event in events_data:
        Event.objects.create(**event)
        print(f"Created: {event['title']}")

if __name__ == '__main__':
    populate()
