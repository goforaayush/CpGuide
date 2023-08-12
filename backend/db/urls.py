from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'question-data', views.QuestionDataViewSet, basename='questiondata')
router.register(r'user-visits', views.UserVisitsViewSet, basename='uservisits')
router.register(r'user-notes', views.UserNotesViewSet, basename='usernotes')

urlpatterns = [
    path('', include(router.urls)),
]
