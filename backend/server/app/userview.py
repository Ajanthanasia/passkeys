from django.shortcuts import render   # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.decorators  import api_view # type: ignore
from .models import User_roles,otp_verification
from django.forms.models import model_to_dict
from django.conf import settings
from django.core.mail import send_mail
import re
import random
from django.utils import timezone

# Create your views here.
def Password_Validation(password):
    SpecialSym =['$', '@', '#', '%']
    val=True
    msg =''
    if len(password) < 6:
        msg='length should be at least 6'
        val = False
         
    if len(password) > 20:
        msg='length should be not be greater than 8'
        val = False
         
    if not any(char.isdigit() for char in password):
        msg='Password should have at least one numeral'
        val = False
         
    if not any(char.isupper() for char in password):
        msg='Password should have at least one uppercase letter'
        val = False
         
    if not any(char.islower() for char in password):
        msg='Password should have at least one lowercase letter'
        val = False
         
    if not any(char in SpecialSym for char in password):
        msg='Password should have at least one of the symbols $@#'
        val = False
    return [val,msg]

@api_view(['POST'])
def Register(request):
    name=request.data.get('name')
    email=request.data.get('email')
    password=request.data.get('password')
    confirm_Password=request.data.get('confirm_Password')
    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'
    print("----1---")
    existing_user =User_roles.objects.filter(email=email).exists()
    if existing_user:
        return Response({'msg':'Already User Email  exists...','Type':'Warning'})
    if password != confirm_Password:
        return Response({'msg':'password is not maching the confirm password','Type':'Danger'})
    if re.match(regex,email) is None:
        return Response({'msg':"{} is an invalid email address.".format(email),'Type':'Danger'})
    values=Password_Validation(password)
    print("----2---")
    if values[0]==False:
        msg=values[1]
        return Response({'msg':msg,'Type':'Warning'})
    otp=""
    for i in range(6):
        otp += str(random.randint(0,9))
        
    subject = 'OTP verification'
    message = f'Hi {name}, thank you thank u for create your account this is ur OTP  {otp}'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail( subject, message, email_from, recipient_list )
    print("----2---")
    if otp:
        user=User_roles()
        user.name=name
        user.email=email
        user.password=password
        user.is_active=False
        user.save() 
        otp_entry = otp_verification(user=user, otp=otp)
        otp_entry.save()
        return Response({'msg':'Successfully Register the User...','Type':'Success'})
    return Response({'msg':'Please type your corect otp','Type':'Warning'})

@api_view(['POST'])
def Login(request):
    email=request.data.get('email')
    password=request.data.get('password')
    try:

        user =User_roles.objects.get(email=email)
        if user.password !=password:
            return Response({'msg': 'Password Authondication Failed','Type':'Warrning'})
        if user.is_active:
            user.id=str(user.id)
            user_dict=model_to_dict(user)
            msg={'Type':'Success'}
            return Response(user_dict|msg)
        return Response({'msg':'wrong authondication','Type':'Danger'})
    except User_roles.DoesNotExist:
        return Response({'msg': 'Authentication failed','Type':'Danger'})
    
@api_view(['POST'])
def otp_verify(request):
    otp_num=request.data.get('otp')
    email=request.data.get('email')

    is_email_exists=User_roles.objects.filter(email=email).exists()
    if is_email_exists is None:
        return Response({'msg':'wrong otp...','Type':'Danger'})
    
    try:
        user = User_roles.objects.get(email=email)
        otp_entry = otp_verification.objects.get(user=user, otp=otp_num)
        if user.is_active==False:
            user.email_verified_at = timezone.now()
            user.is_active = True
            user.save()
            otp_entry.delete()   
            return Response({'msg': 'OTP verified successfully. Registration complete.', 'type': 'Success'})            
    except (User_roles.DoesNotExist, otp_verification.DoesNotExist):
        return Response({'msg': 'Invalid OTP or email.', 'type': 'danger'})     




