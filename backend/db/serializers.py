from rest_framework import serializers
from .models import QuestionData, UserVisits, UserNotes
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=QuestionData
        fields=['topic_id' , 'heading' , 'sub_heading' , 'heading_id' , 'sub_heading_id' , 'topic' , 'link'] 

class UserVisitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVisits
        fields = ['user', 'topicId']

class UserNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotes
        fields = ['user', 'topicId', 'note']
