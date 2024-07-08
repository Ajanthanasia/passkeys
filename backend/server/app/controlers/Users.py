from django.shortcuts import render   # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.decorators  import api_view # type: ignore


# @api_view(['POST'])
# def User_Register(request):
#     username=request.data.get('username')
#     password=request.data.get('password')
#     return Response({'msg': 'Authentication failed','MsgType':'danger'})

