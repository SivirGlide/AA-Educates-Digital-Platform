from rest_framework import serializers
from .models import (
    User,
    StudentProfile,
    ParentProfile,
    SchoolProfile,
    CorporatePartnerProfile,
    AdminProfile,
)
from achievements.models import Badge, Certificate, Skill


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'role', 'is_active', 'is_verified', 'date_joined'
        ]
        read_only_fields = ['date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class SchoolProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolProfile
        fields = ['id', 'user', 'name', 'address']


class StudentProfileSerializer(serializers.ModelSerializer):
    badges = serializers.PrimaryKeyRelatedField(queryset=Badge.objects.all(), many=True, required=False)
    certificates = serializers.PrimaryKeyRelatedField(queryset=Certificate.objects.all(), many=True, required=False)
    skills = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), many=True, required=False)

    class Meta:
        model = StudentProfile
        fields = [
            'id', 'user', 'school', 'bio', 'cv', 'portfolio_link',
            'badges', 'certificates', 'skills'
        ]


class ParentProfileSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(queryset=StudentProfile.objects.all(), many=True, required=False)

    class Meta:
        model = ParentProfile
        fields = ['id', 'user', 'students']


class CorporatePartnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorporatePartnerProfile
        fields = ['id', 'user', 'company_name', 'industry', 'website', 'csr_report_link', 'logo']


class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = ['id', 'user']

