from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import QuestionData, UserVisits, UserNotes
from .serializers import (
    QuestionSerializer,
    UserVisitsSerializer,
    UserNotesSerializer,
)

class QuestionDataViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["GET"])
    def get_question_data(self, request):
        items = QuestionData.objects.all()
        item_data = QuestionSerializer(items, many=True).data
        return Response({"questions": item_data}, status=status.HTTP_200_OK)

class UserVisitsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["POST"])
    def save_user_visit(self, request):
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

    @action(detail=False, methods=["GET"])
    def get_user_visit(self, request):
        user = request.GET.get("user")
        if not user:
            return Response(
                {"error": "User is required in the request body."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_visit = UserVisits.objects.filter(user=user)
        # print(user_visit['user'])
        if user_visit:
            serializer = UserVisitsSerializer(user_visit, many=True)
            return Response(
                {"visited questions": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                "this user has not visited any questions",
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["DELETE"])
    def delete_user_visit(self, request):
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

class UserNotesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    # @action(detail=False, methods=["POST"])
    # def create_user_note(self, request):
    #     user = request.data.get("user")
    #     topic_id = request.data.get("topic_id")
    #     note = request.data.get("note")
    #     if not (user and topic_id and note):
    #         return Response(
    #             {
    #                 "error": "User, topic_id, and note are required in the request data."
    #             },
    #             status=status.HTTP_400_BAD_REQUEST,
    #         )
    #     user_note = UserNotes.objects.filter(user=user, topicId=topic_id).first()
    #     if user_note:
    #         return Response(
    #             {"status": "Note already exists for the user and topic ID."},
    #             status=status.HTTP_200_OK,
    #         )
    #     data = {"user": user, "topicId": topic_id, "note": note}
    #     serializer = UserNotesSerializer(data=data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(
    #             {"status": "New user note saved."}, status=status.HTTP_201_CREATED
    #         )
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["PUT"])
    def update_user_note(self, request):
        user = request.data.get("user")
        topic_id = request.data.get("topic_id")
        note = request.data.get("note")
        if not (user and topic_id and note):
            return Response(
                {
                    "error": "User, topic_id, and note are required in the request data."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_note = UserNotes.objects.filter(user=user, topicId=topic_id).first()
        if not user_note:
            # return Response(
            #     {"status": "Note does not exist for the user and topic ID."},
            #     status=status.HTTP_200_OK,
            # )
            data = {"user": user, "topicId": topic_id, "note": note}
            serializer = UserNotesSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": "New user note saved."}, status=status.HTTP_201_CREATED
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_note.note = note
        user_note.save()
        return Response({"status": "User note updated."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["DELETE"])
    def delete_user_note(self, request):
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

    @action(detail=False, methods=["GET"])
    def get_user_notes(self, request):
        user = request.GET.get("user")
        topic_id = request.GET.get("topic_id")
        print(topic_id)
        if not (user and topic_id):
            return Response(
                {
                    "error": "User and topic_id are required in the query parameters."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        user_notes = UserNotes.objects.filter(user=user, topicId=topic_id)
        
        serializer = UserNotesSerializer(user_notes, many=True)
        print(serializer.data)
        return Response({"user_notes": serializer.data}, status=status.HTTP_200_OK)
