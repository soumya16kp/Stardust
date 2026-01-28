import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'space_backend.settings')
django.setup()

from programs.models import Program, Module, Session, WebinarDetails, HackathonTeam

def populate():
    print("Creating Programs...")

    # 1. Mission: Mars Colonization 101
    mars_mission, created = Program.objects.get_or_create(
        title="Mars Colonization 101",
        defaults={
            'description': "A comprehensive guide to terraforming and sustainable living on the Red Planet. Learn about life support systems, agriculture in Martian soil, and psychology of long-duration spaceflight.",
            'program_type': 'mission',
            'difficulty': 'explorer',
            'instructor': 'Dr. Sarah Al-Fayed',
            'duration': '6 Weeks',
            'xp_reward': 500,
            'image_url': 'https://images.unsplash.com/photo-1614728853975-69c960f7274f?q=80&w=2574&auto=format&fit=crop'
        }
    )
    
    if created:
        # Modules for Mars Mission
        m1 = Module.objects.create(program=mars_mission, title="The Martian Atmosphere", order=1, description="Understanding the thin atmosphere.")
        Session.objects.create(module=m1, title="Atmospheric Composition", session_type="video", content="https://example.com/video1", order=1, duration=15)
        Session.objects.create(module=m1, title="Quiz: Gas Laws", session_type="quiz", content="Questions about pressure...", order=2, duration=10)
        
        m2 = Module.objects.create(program=mars_mission, title="Life Support Systems", order=2, description="Generating Oxygen and Water.")
        Session.objects.create(module=m2, title="MOXIE Technology", session_type="text", content="Reading material about oxygen generation.", order=1, duration=20)
        print(f"Created Mission: {mars_mission.title}")

    # 2. Mission: Rocket Propulsion Fundamentals
    rocket_course, created = Program.objects.get_or_create(
        title="Rocket Propulsion Fundamentals",
        defaults={
            'description': "Master the physics behind getting to orbit. Tsiolkovsky equation, specific impulse, and nozzle design.",
            'program_type': 'mission',
            'difficulty': 'cadet',
            'instructor': 'Cmdr. James Holden',
            'duration': '4 Weeks',
            'xp_reward': 300,
            'image_url': 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2670&auto=format&fit=crop'
        }
    )
    
    if created:
        m1 = Module.objects.create(program=rocket_course, title="Newton's Laws", order=1)
        Session.objects.create(module=m1, title="Action and Reaction", session_type="video", order=1)
        print(f"Created Mission: {rocket_course.title}")

    # 3. Webinar: Future of Starship
    webinar, created = Program.objects.get_or_create(
        title="The Future of Starship",
        defaults={
            'description': "Live discussion on the latest IFT test results and what they mean for Artemis.",
            'program_type': 'webinar',
            'difficulty': 'explorer',
            'instructor': 'Elon Musk (Guest)',
            'duration': '2 Hours',
            'start_date': timezone.now() + timedelta(days=2),
            'is_live': False,
            'image_url': 'https://images.unsplash.com/photo-1541185933-710f50746747?q=80&w=2274&auto=format&fit=crop'
        }
    )
    if created:
        WebinarDetails.objects.create(program=webinar, meeting_link="https://zoom.us/j/123456", speakers="Elon Musk, Tim Dodd")
        print(f"Created Webinar: {webinar.title}")

    # 4. Hackathon: Lunar Rover AI Challenge
    hackathon, created = Program.objects.get_or_create(
        title="Lunar Rover AI Challenge",
        defaults={
            'description': "Code an autonomous navigation path for a rover to traverse the Shackleton Crater. Best algorithm wins a trip to SpaceX HQ.",
            'program_type': 'hackathon',
            'difficulty': 'astronaut',
            'instructor': 'NASA JPL Team',
            'duration': '48 Hours',
            'xp_reward': 2000,
            'image_url': 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2670&auto=format&fit=crop'
        }
    )
    if created:
        print(f"Created Hackathon: {hackathon.title}")

    print("Data population complete.")

if __name__ == '__main__':
    populate()
