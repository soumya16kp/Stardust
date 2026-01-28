import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'space_backend.settings')
django.setup()

from django.contrib.auth.models import User
from social.models import Community, CommunityMember

def create_scenario():
    print("Setting up test scenario...")

    # Create User One
    user1, created1 = User.objects.get_or_create(username='userone', email='one@gmail.com')
    if created1:
        user1.set_password('password123')
        user1.save()
        print(f"Created User One: {user1.username} (one@gmail.com)")
    else:
        print(f"User One already exists: {user1.username}")

    # Create User Two
    user2, created2 = User.objects.get_or_create(username='usertwo', email='two@gmail.com')
    if created2:
        user2.set_password('password123')
        user2.save()
        print(f"Created User Two: {user2.username} (two@gmail.com)")
    else:
        print(f"User Two already exists: {user2.username}")

    # Create Community by User One
    community, comm_created = Community.objects.get_or_create(
        slug='ones-colony',
        defaults={
            'name': "One's Colony",
            'description': "A private colony established by User One.",
            'creator': user1,
            'privacy': 'public' # Making it public so user2 can join easily, or private? User said "member in this community", implies accepted.
        }
    )
    if comm_created:
        print(f"Created Community: {community.name}")
        # Add creator as admin
        CommunityMember.objects.create(community=community, user=user1, role='admin', status='accepted')
    else:
        print(f"Community already exists: {community.name}")

    # Add User Two as member
    member, mem_created = CommunityMember.objects.get_or_create(
        community=community,
        user=user2,
        defaults={
            'role': 'member',
            'status': 'accepted'
        }
    )
    if mem_created:
        print(f"Added {user2.username} to {community.name}")
    else:
        print(f"{user2.username} is already a member of {community.name}")

    print("\nScenario Setup Complete!")
    print(f"Login details:")
    print(f"User One: userone / password123")
    print(f"User Two: usertwo / password123")

if __name__ == '__main__':
    create_scenario()
