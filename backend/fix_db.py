import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'space_backend.settings')
django.setup()

with connection.cursor() as cursor:
    print("Dropping content_event table...")
    cursor.execute("DROP TABLE IF EXISTS content_event")
    print("Dropping content_program table...")
    cursor.execute("DROP TABLE IF EXISTS content_program")
    
    print("Clearing migration history for content app...")
    cursor.execute("DELETE FROM django_migrations WHERE app = 'content'")

print("Database cleanup complete.")
