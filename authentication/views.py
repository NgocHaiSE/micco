from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import jwt

from .serializers import (
    SignUpSerializer, 
    SignInSerializer, 
    UserSerializer,
    PasswordResetSerializer,
    RefreshTokenSerializer
)
from .utils import generate_tokens, verify_token, revoke_refresh_token
from .models import RefreshToken

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """User registration endpoint"""
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        access_token, refresh_token = generate_tokens(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'session': {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expires_at': int((timezone.now() + timezone.timedelta(minutes=15)).timestamp())
            },
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def signin(request):
    """User login endpoint"""
    serializer = SignInSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        access_token, refresh_token = generate_tokens(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'session': {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expires_at': int((timezone.now() + timezone.timedelta(minutes=15)).timestamp())
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def signout(request):
    """User logout endpoint"""
    # Get refresh token from request body or headers
    refresh_token = request.data.get('refresh_token')
    if refresh_token:
        revoke_refresh_token(refresh_token)
    
    return Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """Refresh access token endpoint"""
    serializer = RefreshTokenSerializer(data=request.data)
    if serializer.is_valid():
        refresh_token = serializer.validated_data['refresh_token']
        
        # Verify refresh token
        payload = verify_token(refresh_token, 'refresh')
        if not payload:
            return Response({
                'error': 'Invalid or expired refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if token is revoked
        jti = payload.get('jti')
        if jti and RefreshToken.objects.filter(token=jti, is_revoked=True).exists():
            return Response({
                'error': 'Refresh token has been revoked'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get user and generate new tokens
        try:
            user = User.objects.get(id=payload['user_id'])
            access_token, new_refresh_token = generate_tokens(user)
            
            # Revoke old refresh token
            if jti:
                RefreshToken.objects.filter(token=jti).update(is_revoked=True)
            
            return Response({
                'access_token': access_token,
                'refresh_token': new_refresh_token,
                'expires_at': int((timezone.now() + timezone.timedelta(minutes=15)).timestamp())
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Password reset request endpoint"""
    serializer = PasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            
            # Generate password reset token
            reset_payload = {
                'user_id': str(user.id),
                'exp': timezone.now() + timezone.timedelta(hours=1),
                'type': 'password_reset'
            }
            reset_token = jwt.encode(reset_payload, settings.SECRET_KEY, algorithm='HS256')
            
            # In a real application, you would send this via email
            # For now, we'll just return success
            
            # send_mail(
            #     'Password Reset Request',
            #     f'Click here to reset your password: {settings.FRONTEND_URL}/reset-password?token={reset_token}',
            #     settings.DEFAULT_FROM_EMAIL,
            #     [email],
            #     fail_silently=False,
            # )
            
            return Response({
                'message': 'Password reset instructions sent to your email',
                'reset_token': reset_token  # Remove this in production
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            # Don't reveal if email exists or not
            return Response({
                'message': 'Password reset instructions sent to your email'
            }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Get current user profile"""
    return Response(UserSerializer(request.user).data)