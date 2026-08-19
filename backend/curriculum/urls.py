from django.urls import path
from .views import ChapterListView, LessonDetailView, CompleteLessonView

urlpatterns = [
    path('chapters/', ChapterListView.as_view(), name='curriculum-chapters'),
    path('lessons/<int:lesson_id>/', LessonDetailView.as_view(), name='curriculum-lesson-detail'),
    path('lessons/<int:lesson_id>/complete/', CompleteLessonView.as_view(), name='curriculum-lesson-complete'),
]
