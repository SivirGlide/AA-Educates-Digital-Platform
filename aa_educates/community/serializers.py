from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Post, Comment, GroupChat, Message


class GenericAuthorFieldsMixin(serializers.ModelSerializer):
    author_type = serializers.CharField(write_only=True, required=True)
    author_id = serializers.IntegerField(write_only=True, required=True)

    def assign_generic_author(self, validated_data, type_field='author_type', id_field='author_id', ct_field='author_content_type', obj_id_field='author_object_id'):
        author_type_str = validated_data.pop(type_field)
        author_id = validated_data.pop(id_field)
        try:
            app_label, model_name = author_type_str.split('.')
            ct = ContentType.objects.get(app_label=app_label, model=model_name.lower())
        except Exception as exc:
            raise serializers.ValidationError({type_field: 'Invalid author_type. Use users.StudentProfile or mentorship.MentorProfile'}) from exc
        validated_data[ct_field] = ct
        validated_data[obj_id_field] = author_id
        return validated_data


class PostSerializer(GenericAuthorFieldsMixin):
    class Meta:
        model = Post
        fields = [
            'id', 'content', 'image', 'created_at',
            'likes',
            'author_type', 'author_id', 'author_content_type', 'author_object_id'
        ]
        read_only_fields = ['created_at', 'author_content_type', 'author_object_id']

    def create(self, validated_data):
        validated_data = self.assign_generic_author(validated_data)
        return super().create(validated_data)


class CommentSerializer(GenericAuthorFieldsMixin):
    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'text', 'created_at',
            'author_type', 'author_id', 'author_content_type', 'author_object_id'
        ]
        read_only_fields = ['created_at', 'author_content_type', 'author_object_id']

    def create(self, validated_data):
        validated_data = self.assign_generic_author(validated_data)
        return super().create(validated_data)


class GroupChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupChat
        fields = ['id', 'name', 'members', 'created_at']
        read_only_fields = ['created_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'timestamp']
        read_only_fields = ['timestamp']
