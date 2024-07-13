from django.db import models
# from django.contrib.auth.models import AbstractUser
# from django.core.validators import RegexValidator

# Create your models here.
class User_roles(models.Model):
    id = models.AutoField(primary_key=True,unique=True)
    name = models.CharField( max_length=255)  
    email = models.CharField( max_length=255,unique=True)  
    email_verified_at =  models.DateTimeField(null=True, blank=True)  
    password = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)