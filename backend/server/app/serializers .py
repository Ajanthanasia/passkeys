# from rest_framework import serializers
# from .models import User, OTP

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['email', 'name', 'password']
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = User(
#             email=validated_data['email'],
#             name=validated_data['name']
#         )
#         user.set_password(validated_data['password'])
#         user.save()
#         return user

# class OTPSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OTP
#         fields = ['user', 'otp']
