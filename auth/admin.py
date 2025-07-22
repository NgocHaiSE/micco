from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, RefreshToken

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_email_verified', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_email_verified', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('is_email_verified', 'created_at', 'updated_at')
        }),
    )
    readonly_fields = ['created_at', 'updated_at']

@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token', 'created_at', 'expires_at', 'is_revoked']
    list_filter = ['is_revoked', 'created_at', 'expires_at']
    search_fields = ['user__email', 'token']
    readonly_fields = ['token', 'created_at']