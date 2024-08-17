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
    path('Update_face_recoganize',userview.Update_face_recoganize),
    path('Update_userDetails',userview.Update_userDetails),
    path('register_source',userview.register_source),
    path('get_source_detail/<int:user_id>',userview.get_source_detail),
    path('varify_face_id/<int:user_id>',userview.varify_face_id),
    path('update_source_detail/<int:source_id>',userview.update_source_detail),
    path('delete_source_detail/<int:source_id>',userview.delete_source_detail),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
