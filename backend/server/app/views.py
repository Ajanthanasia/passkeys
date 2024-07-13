from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from django.utils import timezone
from .models import User, OTP
from .serializers  import UserSerializer,OTPSerializer
from random import randint
from datetime import timedelta

class UserRegistrationView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        otp = str(randint(100000, 999999))
        expires_at = timezone.now() + timedelta(minutes=10)
        OTP.objects.create(user=user, otp=otp, expires_at=expires_at)
        # Here you can integrate with an SMS gateway to send the OTP

class VerifyOTPView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        otp = request.data.get('otp')

        try:
            otp_instance = OTP.objects.get(user_id=user_id, otp=otp)
            if otp_instance.expires_at < timezone.now():
                return Response({'detail': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = otp_instance.user
            user.email_verified_at = timezone.now()
            user.save()
            otp_instance.delete()

            return Response({'detail': 'OTP verified successfully.'}, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            return Response({'detail': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)
