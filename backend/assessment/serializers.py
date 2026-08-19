from rest_framework import serializers
from .models import AssessmentProblem, AssessmentSession, ProblemAttemptLog

class AssessmentProblemSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)

    class Meta:
        model = AssessmentProblem
        fields = [
            'id', 'level', 'level_display', 'category', 'category_display',
            'order', 'title', 'description', 'template', 'test_cases',
            'problem_type', 'setup_code', 'weight'
        ]


class ProblemAttemptLogSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    category = serializers.CharField(source='problem.category', read_only=True)
    level = serializers.IntegerField(source='problem.level', read_only=True)

    class Meta:
        model = ProblemAttemptLog
        fields = [
            'id', 'problem', 'problem_title', 'category', 'level',
            'is_passed', 'hint_count', 'model_answer_viewed',
            'attempt_count', 'duration_seconds', 'earned_score', 'user_code'
        ]


class AssessmentSessionSerializer(serializers.ModelSerializer):
    attempts = ProblemAttemptLogSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentSession
        fields = [
            'session_id', 'user_identifier', 'created_at', 'completed_at',
            'is_completed', 'total_score', 'self_reliance_score',
            'category_scores', 'recommended_chapter', 'ai_feedback', 'attempts'
        ]
