from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import User


class Post(models.Model):
    # Generic author: users.StudentProfile or mentorship.MentorProfile
    author_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    author_object_id = models.PositiveIntegerField()
    author = GenericForeignKey('author_content_type', 'author_object_id')

    content = models.TextField()
    image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    likes = models.ManyToManyField(User, blank=True, related_name='liked_posts')

    def __str__(self):
        return f"Post {self.id} by {self.author}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    # Generic author: users.StudentProfile or mentorship.MentorProfile
    author_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    author_object_id = models.PositiveIntegerField()
    author = GenericForeignKey('author_content_type', 'author_object_id')

    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment {self.id} on Post {self.post_id}"


class GroupChat(models.Model):
    name = models.CharField(max_length=200)
    members = models.ManyToManyField(User, related_name='group_chats', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    chat = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_sent')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Msg {self.id} in {self.chat.name}"
