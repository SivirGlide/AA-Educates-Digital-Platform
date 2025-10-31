from rest_framework import viewsets
from .models import Post, Comment, GroupChat, Message
from .serializers import PostSerializer, CommentSerializer, GroupChatSerializer, MessageSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer


class GroupChatViewSet(viewsets.ModelViewSet):
    queryset = GroupChat.objects.all().order_by('-created_at')
    serializer_class = GroupChatSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-timestamp')
    serializer_class = MessageSerializer
