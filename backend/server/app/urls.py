from django.contrib import admin
from django.urls import path,include
from . import userview
# from .views import 

urlpatterns = [
    path('/register',userview.Register),
    # path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('/login',userview.Login),

    # path('/Register',Users.User_Register),

]
# from django.urls import path
# from .views import UserRegistrationView, VerifyOTPView

# urlpatterns = [
#     path('register/', UserRegistrationView.as_view(), name='register'),
#     path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
# ]

