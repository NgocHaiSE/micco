from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_email_verified', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_email_verified']

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    metadata = serializers.DictField(required=False, allow_empty=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'metadata']
    
    def create(self, validated_data):
        metadata = validated_data.pop('metadata', {})
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password.')
        
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class RefreshTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()
