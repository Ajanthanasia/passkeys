from django.shortcuts import render   # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.decorators  import api_view # type: ignore
from .models import User_roles
from django.forms.models import model_to_dict
import re

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

    user=User_roles()
    user.name=name
    user.email=email
    user.password=password
    user.save() 
    return Response({'msg':'Successfully Register the User...','Type':'Success'})


@api_view(['POST'])
def Login(request):
    email=request.data.get('email')
    password=request.data.get('password')
    try:

        user =User_roles.objects.get(email=email)
        if user.password !=password:
            return Response({'msg': 'Password Authondication Failed','Type':'Warrning'})
        user.id=str(user.id)
        user_dict=model_to_dict(user)
        msg={'Type':'Success'}
        return Response(user_dict|msg)
    except User_roles.DoesNotExist:
        return Response({'msg': 'Authentication failed','Type':'danger'})
    


