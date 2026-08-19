from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Chapter, Lesson, LessonExercise, UserLearningProgress
from .serializers import ChapterListSerializer, LessonDetailSerializer

class ChapterListView(APIView):
    """全章とユーザーごとの進捗ロードマップを取得"""
    def get(self, request):
        user_identifier = request.query_params.get('user_identifier', 'anonymous')
        chapters = Chapter.objects.all().prefetch_related('lessons').order_by('order')
        serializer = ChapterListSerializer(chapters, many=True, context={'user_identifier': user_identifier})
        
        # 全体進捗統計
        total_lessons = Lesson.objects.count()
        completed_lessons = UserLearningProgress.objects.filter(
            user_identifier=user_identifier,
            is_completed=True
        ).count()
        overall_progress_pct = round((completed_lessons / total_lessons * 100), 1) if total_lessons else 0.0

        return Response({
            'overall_progress_pct': overall_progress_pct,
            'total_lessons': total_lessons,
            'completed_lessons': completed_lessons,
            'chapters': serializer.data
        })


class LessonDetailView(APIView):
    """レッスンの詳細（解説・例題・演習）を取得"""
    def get(self, request, lesson_id):
        user_identifier = request.query_params.get('user_identifier', 'anonymous')
        lesson = get_object_or_404(Lesson, id=lesson_id)
        serializer = LessonDetailSerializer(lesson)
        
        # ユーザー進捗情報
        progress, _ = UserLearningProgress.objects.get_or_create(
            user_identifier=user_identifier,
            lesson=lesson
        )

        data = serializer.data
        data['user_progress'] = {
            'is_completed': progress.is_completed,
            'is_skipped_by_assessment': progress.is_skipped_by_assessment,
            'exercise_passed': progress.exercise_passed,
            'saved_code': progress.saved_code
        }
        return Response(data)


class CompleteLessonView(APIView):
    """レッスンの読了または演習合格を記録"""
    def post(self, request, lesson_id):
        user_identifier = request.data.get('user_identifier', 'anonymous')
        exercise_passed = bool(request.data.get('exercise_passed', False))
        saved_code = request.data.get('saved_code', '')

        lesson = get_object_or_404(Lesson, id=lesson_id)
        progress, _ = UserLearningProgress.objects.get_or_create(
            user_identifier=user_identifier,
            lesson=lesson
        )

        progress.is_completed = True
        progress.exercise_passed = exercise_passed
        if saved_code:
            progress.saved_code = saved_code
        progress.completed_at = timezone.now()
        progress.save()

        return Response({
            'lesson_id': lesson.id,
            'is_completed': progress.is_completed,
            'exercise_passed': progress.exercise_passed
        }, status=status.HTTP_200_OK)
