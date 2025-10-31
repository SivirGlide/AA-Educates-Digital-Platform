from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Module, Resource, Workbook, WorkbookPurchase


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'video_url', 'resource_file', 'created_by', 'is_published', 'created_at']


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'title', 'file', 'category', 'module']


class WorkbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workbook
        fields = ['id', 'title', 'description', 'price', 'pdf_file', 'created_by']


class WorkbookPurchaseSerializer(serializers.ModelSerializer):
    purchaser_type = serializers.CharField(write_only=True, required=True)
    purchaser_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = WorkbookPurchase
        fields = [
            'id', 'workbook', 'payment_status', 'transaction_id', 'date',
            'purchaser_type', 'purchaser_id', 'purchaser_content_type', 'purchaser_object_id'
        ]
        read_only_fields = ['purchaser_content_type', 'purchaser_object_id', 'date']

    def create(self, validated_data):
        purchaser_type_str = validated_data.pop('purchaser_type')
        purchaser_id = validated_data.pop('purchaser_id')
        try:
            app_label, model_name = purchaser_type_str.split('.')
            ct = ContentType.objects.get(app_label=app_label, model=model_name.lower())
        except Exception as exc:
            raise serializers.ValidationError({'purchaser_type': 'Invalid purchaser_type. Use users.ParentProfile or users.SchoolProfile'}) from exc
        validated_data['purchaser_content_type'] = ct
        validated_data['purchaser_object_id'] = purchaser_id
        return super().create(validated_data)
