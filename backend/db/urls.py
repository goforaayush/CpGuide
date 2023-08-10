from django.urls import path,include
from . import views

urlpatterns = [

    path('getQuestionData' , views.getQuestionData),
    path('createUserNote', views.create_user_note),
    path('updateUserNote', views.update_user_note),
    path('deleteUserNote', views.delete_user_note),
    path('getUserNotes', views.get_user_notes),
    # path('getNoteByUserAndTopic', views.get_note_by_user_and_topic),
    path('saveUserVisit', views.saveUserVisit),
    path('deleteUserVisit', views.deleteUserVisit),
    
     
]