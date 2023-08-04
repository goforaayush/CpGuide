from rest_framework import serializers
from .models import QuestionData
class questionSerializer(serializers.ModelSerializer):
    class Meta:
        model=QuestionData
        fields=['topic_id' , 'heading' , 'sub_heading' , 'heading_id' , 'sub_heading_id' , 'topic' , 'link'] 