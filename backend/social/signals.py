from django.db.models.signals importAE import post_save
from django.dispatch import receiver
from .models import Message, Comment, Post, Notification

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.receiver,
            type='message',
            actor=instance.sender,
            content=f"Sent you a message: {instance.content[:30]}...",
            related_link='/messages' # Placeholder
        )

@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    if created:
        # Notify post author
        if instance.post.author != instance.author:
            Notification.objects.create(
                recipient=instance.post.author,
                type='interaction',
                actor=instance.author,
                content=f"commented on your post in {instance.post.community.name}",
                related_link=f"/social?post={instance.post.id}" 
            )

# Could add more (Likes, etc.)
