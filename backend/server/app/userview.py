from django.shortcuts import render   # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.decorators  import api_view # type: ignore
from .models import User_roles,otp_verification,face_recoganizer,add_source
import face_recognition
import pandas as pd
# import fingerprint
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
from django.contrib.auth.hashers import make_password
from cryptography.fernet import Fernet
import hashlib

cipher_suite = Fernet(settings.ENCRYPTION_KEY)

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

def Upload_image(image_data,email):
    msg=""
    Val=True
    Type=""
    try:
        user = User_roles.objects.get(email=email)
        format, imgstr = image_data.split(';base64,')
        # ext = format.split('/')[-1]
        ext='jpg'
        date=datetime.now()
        file_name = f"{user.name}_{date}.{ext}"
        file_content = ContentFile(base64.b64decode(imgstr), name=file_name)
        existing_faceRecoganize = face_recoganizer.objects.filter(user=user).first()
        if existing_faceRecoganize:
            old_image_path = existing_faceRecoganize.image.path
            existing_faceRecoganize.image.save(file_name, file_content)
            existing_faceRecoganize.name = user.name
            existing_faceRecoganize.save()
            user.Is_activate_image_recoganize=True
            user.save()
            if os.path.exists(old_image_path):
                os.remove(old_image_path)        
        face_rec_entry = face_recoganizer(user=user, name=user.name)
        face_rec_entry.image.save(file_name, file_content)
        face_rec_entry.save()
        user.Is_activate_image_recoganize=True
        user.save()
        msg='Image registered successfully. Registration complete.'
        Val=False
        Type='Success'
    except User_roles.DoesNotExist:
        user = User_roles.objects.get(email=email)
        user.delete()
        msg='Invalid user ID'
        Type='Danger'
    except Exception as e:
        user.delete()
        msg= str(e)
        Type= 'Danger'
    return [Type,msg]

@api_view(['POST'])
def Update_userDetails_email(request,user_id):
    new_name=request.data.get('username')
    new_email=request.data.get('email')
    print("-----",new_name)
    user=User_roles.objects.get(id=user_id)
    
    old_email=user.email
    try:
        existing_user = User_roles.objects.filter(email=new_email).first()
        if existing_user:
            if existing_user.is_active:
                return Response({'msg': 'User email already exists', 'Type': 'Warning'})
            else:
                existing_user.delete()
    # Generate a 6-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        subject = 'Email changed OTP verification'
        message = f'Hi {new_name}, thank you for Update your account. This is your new email OTP: {otp}'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [new_email]
        send_mail(subject, message, email_from, recipient_list)
        
        # for old email notification 
        subject = 'Email Alert System'
        message = f'Hi {user.name}, Someone changed your acount {platform.system()}'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [old_email]
        send_mail(subject, message, email_from, recipient_list)
       
        if otp:
            # Encrypt the password before saving it
            print(type(new_name),"-----after that name")
            user.name = new_name, 
            user.email=new_email
            user.is_active=False
            user.save()

            otp_entry = otp_verification(user=user, otp=otp)
            otp_entry.save()
            # user_afterUpdate = User_roles.objects.get(email=new_email)
            # user_dict = model_to_dict(user_afterUpdate)
            # msg = {'Type': 'Success'}
            # return Response({**user_dict, **msg})
            return Response({'msg': 'Successfully Update the user...', 'Type': 'Success'})
        return Response({'msg': 'Please type your correct OTP', 'Type': 'Warning'})
    except Exception as e:
        return Response({'msg': str(e), 'Type': 'Error'})
        



@api_view(['POST'])
def Register(request):
    name = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    confirm_Password = request.data.get('confirm_Password')
    image_data = request.data.get('image')

    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'
        
    try:
        existing_user = User_roles.objects.filter(email=email).first()
        if existing_user:
            if existing_user.is_active:
                return Response({'msg': 'User email already exists', 'Type': 'Warning'})
                
            else:
                existing_user.delete()               

        # Check if password and confirm password match
        if password != confirm_Password:
            return Response({'msg': 'Password does not match the confirm password', 'Type': 'Danger'})
        
        # Validate the email format
        if re.match(regex, email) is None:
            return Response({'msg': f"{email} is an invalid email address.", 'Type': 'Danger'})
        
        values = Password_Validation(password)
        if not values[0]:
            return Response({'msg': values[1], 'Type': 'Warning'})
        
        # Generate a 6-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        subject = 'OTP verification'
        message = f'Hi {name}, thank you for creating your account. This is your OTP: {otp}'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]
        send_mail(subject, message, email_from, recipient_list)
        
        if otp:
            # Encrypt the password before saving it
            encrypted_password = cipher_suite.encrypt(password.encode()).decode()
            user = User_roles(name=name, email=email, password=encrypted_password, is_active=False)
            user.save()

            # Save the uploaded image (if any)
            upload_img = Upload_image(image_data, email)
            if upload_img[0] == 'Success':
                otp_entry = otp_verification(user=user, otp=otp)
                otp_entry.save()
                return Response({'msg': 'Successfully registered the user...', 'Type': 'Success'})
            else:
                return Response({'msg': upload_img[1], 'Type': 'danger'})
        
        return Response({'msg': 'Please type your correct OTP', 'Type': 'Warning'})

    except Exception as e:
        return Response({'msg': str(e), 'Type': 'Error'})
    
@api_view(['POST'])
def Login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    image_pic = request.data.get('image')
    
    try:
        user = User_roles.objects.get(email=email)
        pw=user.password      
        decrypted_password = cipher_suite.decrypt(pw.encode()).decode()
        print(decrypted_password,'----------decrypted_password')
        if str(decrypted_password) != password:
            return Response({'msg': 'Password Authentication Failed', 'Type': 'Warning'})
        if user.is_active:
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
                
                test = face_recognition.load_image_file(file_content)
                test = cv2.cvtColor(test, cv2.COLOR_BGR2RGB)
                
                test_encode = face_recognition.face_encodings(test)[0]
                validate = face_recognition.compare_faces([train_elon_encodings], test_encode)
                if bool(validate[0]):
                    path_image = 'face_recognition_pic/' + f
                    image_object = face_recoganizer.objects.get(image=path_image)
                    user = User_roles.objects.get(id=image_object.user_id)
                    
                    subject = 'Email Alert System'
                    message = f'Hi {user.name}, Someone logged in to {platform.system()}'
                    email_from = settings.EMAIL_HOST_USER
                    recipient_list = [email]
                    send_mail(subject, message, email_from, recipient_list)

                    user.id = str(user.id)
                    user_dict = model_to_dict(user)
                    msg = {'Type': 'Success'}
                    return Response({**user_dict, **msg})
            return Response({'msg': 'Face recognition failed', 'Type': 'Warning'})
        return Response({'msg': 'Wrong Authentication', 'Type': 'Danger'})
            
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
def otp_update_verify(request):
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
            user_dict = model_to_dict(user)
            msg = {'Type': 'Success'}
            return Response({**user_dict, **msg})
            # return Response({'msg': 'OTP verified successfully. Registration complete.', 'Type': 'Success'})            
    except (User_roles.DoesNotExist, otp_verification.DoesNotExist):
        return Response({'msg': 'Invalid OTP or email.', 'Type': 'danger'})     


@api_view(['POST'])
def Update_face_recoganize(request):
    image_data = request.data.get('image')
    user_id = request.data.get('user_id')
    name = request.data.get('name')
    try:
        user = User_roles.objects.get(id=user_id)
        format, imgstr = image_data.split(';base64,')
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



@api_view(['POST'])
def register_source(request):
    user_id=request.data.get('user_id')
    source=request.data.get('source')
    source_url=request.data.get('source_url')
    password=request.data.get('password')
    encrypted_password = cipher_suite.encrypt(password.encode()).decode()
   
    try:
        user=User_roles.objects.get(id=user_id)
        obj = add_source()
        obj.user=user
        obj.source=source
        obj.source_url=source_url
        obj.password=encrypted_password
        obj.save()
        return Response({'msg':'Succesfuly add the source','Type':'Success'})
    except User_roles.DoesNotExist:
        return Response({'msg': 'Invalid user ID', 'type': 'danger'})
    

@api_view(['GET'])
def get_source_detail(request,user_id):
    source= add_source.objects.filter(user=int(user_id)).values()
    if source is None:
        msg = {'Type': 'warning'}
        return Response(msg)
    # source.id = str(source.id)
    source_pd = pd.DataFrame(source)
    source_pd[['id']]=source_pd[['id']].astype(str)
    # Assuming source_pd['password'] is a Series containing encrypted passwords
    source_pd['decrypted_password'] = source_pd['password'].apply(lambda x: cipher_suite.decrypt(x.encode()).decode())
    source_dict=source_pd.to_dict(orient='records')
    msg = {'Type': 'Success'}
    return Response(source_dict)

@api_view(['POST'])
def update_source_detail(request,source_id):
    user_id=request.data.get('user_id')
    source=request.data.get('source')
    source_url=request.data.get('source_url')
    password=request.data.get('password')
    encrypted_password = cipher_suite.encrypt(password.encode()).decode()
    try:
        user=User_roles.objects.get(id=user_id)
        obj = add_source.objects.get(id=source_id)
        obj.user=user
        obj.source=source
        obj.source_url=source_url
        obj.password=encrypted_password
        obj.save()
        return Response({'msg':'Succesfuly updated the source','Type':'Success'})
    except User_roles.DoesNotExist:
        return Response({'msg': 'Invalid user ID', 'type': 'danger'})

@api_view(['POST'])
def delete_source_detail(request,source_id):
    user_id=request.data.get('user_id')
    print("here,   ",user_id,source_id)
    try:
        user=User_roles.objects.get(id=user_id)
        obj = add_source.objects.get(id=source_id)
        obj.delete()
        return Response({'msg':'Succesfuly delete the source','Type':'Success'})
    except User_roles.DoesNotExist:
        return Response({'msg': 'Invalid user ID', 'type': 'danger'})
    
@api_view(['POST'])
def varify_face_id(request,user_id):
    image_pic = request.data.get('image')

    try:
        user = User_roles.objects.get(id=user_id)

        if user:
            format, imgstr = image_pic.split(';base64,')
            ext = 'jpg'
            date = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_name = f"{date}.{ext}"
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
                    
                    user.id = str(user.id)
                    return Response({'Type': 'Success'})
            return Response({'msg': 'Face varification failed', 'Type': 'Warning'})
        return Response({'msg': 'Wrong Authentication', 'Type': 'Danger'})
            
    except User_roles.DoesNotExist:
        return Response({'msg': 'Authentication failed', 'Type': 'Danger'})
    except Exception as e:
        return Response({'msg': str(e), 'Type': 'Danger'})


@api_view(['POST'])
def UpdateChagePassword(request,user_id):
    password=request.data.get('password')
    New_password=request.data.get('newPassword')
    confirm_password=request.data.get('ConfirmPassword')
    
    try:
        user=User_roles.objects.get(id=user_id)
        old_pw=user.password
        email=user.email
        decrypted_password = cipher_suite.decrypt(old_pw.encode()).decode()
      
        if str(decrypted_password) != password:
            return Response({'msg': 'Password Authentication Failed', 'Type': 'Warning'})
        else:
            if New_password==confirm_password:
              
                values = Password_Validation(New_password)
                if not values[0]:
                    return Response({'msg': values[1], 'Type': 'Warning'})
                subject = 'Change password'
                message = f'Hi {user.name}, Password changed successfuly'
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [email]
                send_mail(subject, message, email_from, recipient_list)
                encrypted_password = cipher_suite.encrypt(New_password.encode()).decode()
                user.password=encrypted_password
                user.save()                
                return Response({'Type': 'Success'})
            else:
                print("error come ")
                return Response({'msg': 'Confirm password not same as new password', 'Type': 'Warning'})
    except Exception as e:
        return Response({'msg': str(e), 'Type': 'Danger'})
    # return Response({'Type': 'Success'})

