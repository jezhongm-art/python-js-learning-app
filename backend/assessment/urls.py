from django.urls import path
from .views import (
    StartAssessmentView,
    RequestHintView,
    RequestModelAnswerView,
    SubmitProblemAttemptView,
    CompleteAssessmentView,
    GetSessionSummaryView
)

urlpatterns = [
    path('start/', StartAssessmentView.as_view(), name='assessment-start'),
    path('hint/', RequestHintView.as_view(), name='assessment-hint'),
    path('answer/', RequestModelAnswerView.as_view(), name='assessment-answer'),
    path('submit/', SubmitProblemAttemptView.as_view(), name='assessment-submit'),
    path('complete/', CompleteAssessmentView.as_view(), name='assessment-complete'),
    path('session/<str:session_id>/', GetSessionSummaryView.as_view(), name='assessment-session'),
]
