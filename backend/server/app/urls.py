from django.contrib import admin
from django.urls import path,include
from . import views
from .controlers import Users

urlpatterns = [
    path('/',views.index),
    # path('/Register',Users.User_Register),

]
