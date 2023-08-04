from db.serializers import questionSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


from rest_framework import status
from .models import QuestionData
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes,permission_classes
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
# @authentication_classes([SessionAuthentication,TokenAuthentication])
# @permission_classes([IsAuthenticated])
def getQuestionData(request):
    try:
        items = QuestionData.objects.all()
        item_data = questionSerializer(items, many = True).data
        print (item_data)
        return Response({'questions' : item_data},status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
