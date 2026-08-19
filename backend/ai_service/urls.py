from django.urls import path
from .views import AiLearningAdviceView

urlpatterns = [
    path('advice/', AiLearningAdviceView.as_view(), name='ai-learning-advice'),
]
