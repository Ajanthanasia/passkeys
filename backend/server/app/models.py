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
    is_active=models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Is_activate_image_recoganize=models.BooleanField(default=False)
    Is_activate_Fingerprint_recoganize=models.BooleanField(default=False)

class otp_verification(models.Model):
    id = models.AutoField(primary_key=True,unique=True)
    user = models.ForeignKey(User_roles, on_delete=models.CASCADE, related_name='otp_verifications')
    otp= models.CharField( max_length=6) 


class face_recoganizer(models.Model):
    id=models.AutoField(primary_key=True,unique=True)
    user = models.ForeignKey(User_roles, on_delete=models.CASCADE, related_name='face_recoganize')
    name=models.CharField(max_length=50)
    image = models.ImageField(upload_to='face_recognition_pic/', height_field=None, width_field=None, max_length=100)
    
class add_source(models.Model):
    id=models.AutoField(primary_key=True,unique=True)
    user=models.ForeignKey(User_roles, on_delete=models.CASCADE, related_name='source')
    source=models.CharField(max_length=250)
    source_url=models.CharField(max_length=250)
    password=models.CharField(max_length=255)
    
    
    