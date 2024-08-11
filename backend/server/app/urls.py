from django.contrib import admin
from django.urls import path,include
from . import userview
# from .views import 
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('register',userview.Register),
    path('login',userview.Login),
    path('otp',userview.otp_verify),
    path('register_face_recog',userview.register_face_recoganize),
    path('Update_userDetails',userview.Update_userDetails),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
