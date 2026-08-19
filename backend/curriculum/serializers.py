from rest_framework import serializers
from .models import Chapter, Lesson, LessonExercise, UserLearningProgress

class LessonExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonExercise
        fields = [
            'id', 'title', 'description', 'template',
            'test_cases', 'setup_code', 'solution_code', 'explanation'
        ]


class LessonDetailSerializer(serializers.ModelSerializer):
    exercise = LessonExerciseSerializer(read_only=True)
    chapter_title = serializers.CharField(source='chapter.title', read_only=True)
    chapter_order = serializers.IntegerField(source='chapter.order', read_only=True)

    class Meta:
        model = Lesson
        fields = [
            'id', 'chapter', 'chapter_order', 'chapter_title', 'order',
            'title', 'reading_time_minutes', 'content_html',
            'key_takeaways', 'example_code', 'exercise'
        ]


class LessonSummarySerializer(serializers.ModelSerializer):
    user_status = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'order', 'title', 'reading_time_minutes', 'user_status'
        ]

    def get_user_status(self, obj):
        user_identifier = self.context.get('user_identifier', 'anonymous')
        try:
            progress = UserLearningProgress.objects.get(user_identifier=user_identifier, lesson=obj)
            return {
                'is_completed': progress.is_completed,
                'is_skipped_by_assessment': progress.is_skipped_by_assessment,
                'exercise_passed': progress.exercise_passed
            }
        except UserLearningProgress.DoesNotExist:
            return {
                'is_completed': False,
                'is_skipped_by_assessment': False,
                'exercise_passed': False
            }


class ChapterListSerializer(serializers.ModelSerializer):
    lessons = LessonSummarySerializer(many=True, read_only=True)
    completed_lessons_count = serializers.SerializerMethodField()
    total_lessons_count = serializers.SerializerMethodField()
    is_mastered = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = [
            'id', 'order', 'title', 'subtitle', 'icon', 'category',
            'target_level', 'summary', 'lessons',
            'completed_lessons_count', 'total_lessons_count', 'is_mastered'
        ]

    def get_total_lessons_count(self, obj):
        return obj.lessons.count()

    def get_completed_lessons_count(self, obj):
        user_identifier = self.context.get('user_identifier', 'anonymous')
        return UserLearningProgress.objects.filter(
            user_identifier=user_identifier,
            lesson__chapter=obj,
            is_completed=True
        ).count()

    def get_is_mastered(self, obj):
        user_identifier = self.context.get('user_identifier', 'anonymous')
        total = obj.lessons.count()
        if total == 0:
            return False
        skipped = UserLearningProgress.objects.filter(
            user_identifier=user_identifier,
            lesson__chapter=obj,
            is_skipped_by_assessment=True
        ).count()
        return skipped == total
