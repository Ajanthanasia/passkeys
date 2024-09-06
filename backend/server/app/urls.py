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
    path('otp_update',userview.otp_update_verify),
    path('Update_face_recoganize',userview.Update_face_recoganize),
    path('Update_userDetails',userview.Update_userDetails),
    path('register_source',userview.register_source),
    path('get_source_detail/<int:user_id>',userview.get_source_detail),
    path('varify_face_id/<int:user_id>',userview.varify_face_id),
    path('update_source_detail/<int:source_id>',userview.update_source_detail),
    path('delete_source_detail/<int:source_id>',userview.delete_source_detail),
    
    path('Update_userDetails_email/<int:user_id>',userview.Update_userDetails_email),
    path('UpdateChagePassword/<int:user_id>',userview.UpdateChagePassword),
    

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
