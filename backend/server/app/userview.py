from django.shortcuts import render   # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.decorators  import api_view # type: ignore
from .models import User_roles,otp_verification,face_recoganizer
import face_recognition
import cv2
from django.forms.models import model_to_dict
from django.conf import settings
from django.core.mail import send_mail
import re
import sys
from datetime import datetime
import platform
import sysconfig
import os
from pathlib import Path
import random
from django.utils import timezone
from django.core.files.base import ContentFile
import base64
from django.core.files.storage import default_storage


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
    name=request.data.get('username')
    email=request.data.get('email')
    password=request.data.get('password')
    confirm_Password=request.data.get('confirm_Password')
    
    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'

    existing_user =User_roles.objects.filter(email=email).exists()
    if existing_user:
        return Response({'msg':'Already User Email  exists...','Type':'Warning'})
    if password != confirm_Password:
        return Response({'msg':'password is not maching the confirm password','Type':'Danger'})
    if re.match(regex,email) is None:
        return Response({'msg':"{} is an invalid email address.".format(email),'Type':'Danger'})
    values=Password_Validation(password)

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
    email = request.data.get('email')
    password = request.data.get('password')
    image_pic = request.data.get('image')

    try:
        if image_pic is None:
            user = User_roles.objects.get(email=email)
            if user.password != password:
                return Response({'msg': 'Password Authentication Failed', 'Type': 'Warning'})

            if user.is_active:
                # Send email alert
                subject = 'Email Alert System'
                message = f'Hi {user.name}, Someone logged in to {platform.system()}'
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [email]
                send_mail(subject, message, email_from, recipient_list)

                user.id = str(user.id)
                user_dict = model_to_dict(user)
                msg = {'Type': 'Success'}
                return Response({**user_dict, **msg})
            return Response({'msg': 'Wrong Authentication', 'Type': 'Danger'})

        else:
            format, imgstr = image_pic.split(';base64,')
            ext = 'jpg'
            date = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_name = f"a_{date}.{ext}"
            file_content = ContentFile(base64.b64decode(imgstr), name=file_name)

            MEDIA_ROOT = Path(settings.MEDIA_ROOT) / 'face_recognition_pic'

            for f in os.listdir(str(MEDIA_ROOT)):
                # db contain file checking
                image_file = os.path.join(str(MEDIA_ROOT), f)
                imgelon = face_recognition.load_image_file(image_file)
                imgelon = cv2.cvtColor(imgelon, cv2.COLOR_BGR2RGB)
                train_elon_encodings = face_recognition.face_encodings(imgelon)[0]
                
                # testing file checking
                test = face_recognition.load_image_file(file_content)
                test = cv2.cvtColor(test, cv2.COLOR_BGR2RGB)
                test_encode = face_recognition.face_encodings(test)[0]
                
                validate = face_recognition.compare_faces([train_elon_encodings], test_encode)
                if validate[0]:
                    path_image = 'face_recognition_pic/' + f
                    image_object = face_recoganizer.objects.get(image=path_image)
                    user = User_roles.objects.get(id=image_object.user_id)
                    user_dict = model_to_dict(user)
                    msg = {'Type': 'Success'}
                    return Response({**user_dict, **msg})
            return Response({'msg': 'Face recognition failed', 'Type': 'Warning'})

    except User_roles.DoesNotExist:
        return Response({'msg': 'Authentication failed', 'Type': 'Danger'})
    except Exception as e:
        return Response({'msg': str(e), 'Type': 'Danger'})


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
            return Response({'msg': 'OTP verified successfully. Registration complete.', 'Type': 'Success'})            
    except (User_roles.DoesNotExist, otp_verification.DoesNotExist):
        return Response({'msg': 'Invalid OTP or email.', 'Type': 'danger'})     


@api_view(['POST'])
def register_face_recoganize(request):
    image_data = request.data.get('image')
    user_id = request.data.get('user_id')
    name = request.data.get('name')
    try:
        user = User_roles.objects.get(id=user_id)
        format, imgstr = image_data.split(';base64,')
        # ext = format.split('/')[-1]
        ext='jpg'
        date=datetime.now()
        file_name = f"{name}_{user_id}_{date}.{ext}"

        file_content = ContentFile(base64.b64decode(imgstr), name=file_name)

        existing_faceRecoganize = face_recoganizer.objects.filter(user=user).first()
        if existing_faceRecoganize:
            old_image_path = existing_faceRecoganize.image.path
            existing_faceRecoganize.image.save(file_name, file_content)
            existing_faceRecoganize.name = name
            existing_faceRecoganize.save()
            user.Is_activate_image_recoganize=True
            user.save()
            if os.path.exists(old_image_path):
                os.remove(old_image_path)
            return Response({'msg': 'Image Updated successfully', 'type': 'Success'})

        face_rec_entry = face_recoganizer(user=user, name=name)
        face_rec_entry.image.save(file_name, file_content)
        face_rec_entry.save()
        user.Is_activate_image_recoganize=True
        user.save()
        return Response({'msg': 'Image registered successfully. Registration complete.', 'type': 'Success'})
    except User_roles.DoesNotExist:
        return Response({'msg': 'Invalid user ID', 'type': 'danger'})
    except Exception as e:
        return Response({'msg': str(e), 'type': 'danger'})

@api_view(['POST'])
def Update_userDetails(request):
    name=request.data.get('username')
    email=request.data.get('email')

    user=User_roles.objects.get(email=email)
    user.name=name
    user.save() 
    user_afterUpdate = User_roles.objects.get(email=email)
    user_dict = model_to_dict(user_afterUpdate)
    msg = {'Type': 'Success'}
    return Response({**user_dict, **msg})
