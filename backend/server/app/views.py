from django.shortcuts import render   # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.decorators  import api_view # type: ignore

# Create your views here.
@api_view(['GET'])
def index(request):
    return Response({'msg': 'Authentication failed','MsgType':'danger'})

