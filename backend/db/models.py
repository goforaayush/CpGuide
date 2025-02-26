from django.db import models
from django.contrib.auth.models import User

class QuestionData(models.Model):
    topic_id = models.CharField(max_length=3)
    heading = models.CharField(max_length=255)
    sub_heading = models.CharField(max_length=255)
    heading_id = models.CharField(max_length=3)
    sub_heading_id = models.CharField(max_length=3)
    topic = models.CharField(max_length=255)
    link = models.TextField()
    yt = models.TextField()
   
class UserVisits(models.Model):
    user = models.CharField(max_length=255)
    topicId = models.CharField(max_length=3)

class UserNotes(models.Model):
    user = models.CharField(max_length=255)
    topicId = models.CharField(max_length=255)
    note = models.TextField()
