import jwt
import uuid
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from .models import RefreshToken

def generate_tokens(user):
    """Generate access and refresh tokens for a user"""
    # Access Token (15 minutes)
    access_payload = {
        'user_id': str(user.id),
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(minutes=15),
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')
    
    # Refresh Token (7 days)
    refresh_payload = {
        'user_id': str(user.id),
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow(),
        'type': 'refresh',
        'jti': str(uuid.uuid4())  # Unique identifier
    }
    refresh_token_str = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm='HS256')
    
    # Save refresh token to database
    refresh_token = RefreshToken.objects.create(
        user=user,
        token=refresh_payload['jti'],
        expires_at=timezone.now() + timedelta(days=7)
    )
    
    return access_token, refresh_token_str

def verify_token(token, token_type='access'):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        if payload.get('type') != token_type:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def revoke_refresh_token(token):
    """Revoke a refresh token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        jti = payload.get('jti')
        if jti:
            RefreshToken.objects.filter(token=jti).update(is_revoked=True)
    except jwt.InvalidTokenError:
        pass