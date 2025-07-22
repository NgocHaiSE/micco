from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.signup, name='auth_signup'),
    path('signin', views.signin, name='auth_signin'),
    path('signout', views.signout, name='auth_signout'),
    path('refresh', views.refresh_token, name='auth_refresh'),
    path('reset-password', views.reset_password, name='auth_reset_password'),
    path('me', views.me, name='auth_me'),
]