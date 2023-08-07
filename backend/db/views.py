from db.serializers import questionSerializer, UserVisitsSerializer, UserNotesSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


from rest_framework import status
from .models import QuestionData, UserVisits, UserNotes
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated


@api_view(["GET"])
# @authentication_classes([SessionAuthentication,TokenAuthentication])
# @permission_classes([IsAuthenticated])
def getQuestionData(request):
    try:
        items = QuestionData.objects.all()
        item_data = questionSerializer(items, many=True).data
        print(item_data)
        return Response({"questions": item_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def saveUserVisit(request):
    try:
        user = request.data.get("user")
        topic_id = request.data.get("topic_id")
        if not (user and topic_id):
            return Response(
                {"error": "User and topic_id are required in the request data."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_visit = UserVisits.objects.filter(user=user, topicId=topic_id).first()
        if user_visit:
            return Response(
                {"status": "User and topic ID already exist in the UserVisits table."},
                status=status.HTTP_200_OK,
            )
        data = {"user": user, "topicId": topic_id}
        serializer = UserVisitsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "New user visit saved to UserVisits table."},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def deleteUserVisit(request):
    try:
        user = request.data.get("user")
        topic_id = request.data.get("topic_id")
        if not (user and topic_id):
            return Response(
                {"error": "User and topic_id are required in the request data."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_visit = UserVisits.objects.filter(user=user, topicId=topic_id).first()
        if not user_visit:
            return Response(
                {"status": "User and topic ID do not exist in the UserVisits table."},
                status=status.HTTP_200_OK,
            )
        user_visit.delete()
        return Response(
            {"status": "User visit deleted from UserVisits table."},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_user_note(request):
    try:
        user = request.data.get("user")
        topic_id = request.data.get("topic_id")
        note = request.data.get("note")
        if not (user and topic_id and note):
            return Response(
                {"error": "User, topic_id, and note are required in the request data."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_note = UserNotes.objects.filter(user=user, topicId=topic_id).first()
        if user_note:
            return Response(
                {"status": "Note already exists for the user and topic ID."},
                status=status.HTTP_200_OK,
            )
        data = {"user": user, "topicId": topic_id, "note": note}
        serializer = UserNotesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "New user note saved."}, status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user_note(request):
    try:
        user = request.data.get("user")
        topic_id = request.data.get("topic_id")
        note = request.data.get("note")
        if not (user and topic_id and note):
            return Response(
                {"error": "User, topic_id, and note are required in the request data."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_note = UserNotes.objects.filter(user=user, topicId=topic_id).first()
        if not user_note:
            return Response(
                {"status": "Note does not exist for the user and topic ID."},
                status=status.HTTP_200_OK,
            )
        user_note.note = note
        user_note.save()
        return Response({"status": "User note updated."}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_user_note(request):
    try:
        user = request.data.get("user")
        topic_id = request.data.get("topic_id")
        if not (user and topic_id):
            return Response(
                {"error": "User and topic_id are required in the request data."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_note = UserNotes.objects.filter(user=user, topicId=topic_id).first()
        if not user_note:
            return Response(
                {"status": "Note does not exist for the user and topic ID."},
                status=status.HTTP_200_OK,
            )
        user_note.delete()
        return Response({"status": "User note deleted."}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_notes(request):
    try:
        user = request.query_params.get("user")
        topic_id = request.query_params.get("topic_id")
        if not (user and topic_id):
            return Response(
                {"error": "User and topic_id are required in the query parameters."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_notes = UserNotes.objects.filter(user=user, topicId=topic_id)
        serializer = UserNotesSerializer(user_notes, many=True)
        return Response({"user_notes": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)





#function to get note by topic and user
# @api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def get_note_by_user_and_topic(request):
#     try:
#         user = request.query_params.get('user')
#         topic_id = request.query_params.get('topic_id')
#         if not (user and topic_id):
#             return Response({'error': 'User and topic_id are required in the query parameters.'}, status=status.HTTP_400_BAD_REQUEST)
#         user_note = UserNotes.objects.filter(user=user, topicId=topic_id).first()
#         if not user_note:
#             return Response({'status': 'Note does not exist for the user and topic ID.'}, status=status.HTTP_404_NOT_FOUND)
#         serializer = UserNotesSerializer(user_note)
#         return Response({'user_note': serializer.data}, status=status.HTTP_200_OK)
#     except Exception as e:
#         print(e)
#         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)