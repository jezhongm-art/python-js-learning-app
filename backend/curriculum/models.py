from django.db import models

class Chapter(models.Model):
    order = models.IntegerField(unique=True, help_text='章番号 (1-8)')
    title = models.CharField(max_length=200, help_text='章タイトル (例: 第1章: Pythonの第一歩とデータ型)')
    subtitle = models.CharField(max_length=255, blank=True, default='', help_text='サブタイトル')
    icon = models.CharField(max_length=50, default='book', help_text='アイコン名')
    category = models.CharField(max_length=50, default='basic')
    target_level = models.IntegerField(default=1, help_text='対象レベル (1-4)')
    summary = models.TextField(blank=True, default='', help_text='章の概要・到達目標')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} - {self.subtitle}"


class Lesson(models.Model):
    chapter = models.ForeignKey(Chapter, related_name='lessons', on_delete=models.CASCADE)
    order = models.IntegerField(default=1, help_text='レッスン順序')
    title = models.CharField(max_length=200, help_text='単元タイトル (例: 1.1 変数宣言と数値演算)')
    reading_time_minutes = models.IntegerField(default=5, help_text='読了目安時間(分)')
    
    # 教科書コンテンツ
    content_html = models.TextField(help_text='HTML形式のリッチ解説コンテンツ')
    key_takeaways = models.JSONField(default=list, help_text='重要ポイント箇条書きリスト')
    example_code = models.TextField(blank=True, default='', help_text='実行可能なサンプルコード')

    class Meta:
        ordering = ['chapter__order', 'order']
        unique_together = ('chapter', 'order')

    def __str__(self):
        return f"[{self.chapter.order}-{self.order}] {self.title}"


class LessonExercise(models.Model):
    lesson = models.OneToOneField(Lesson, related_name='exercise', on_delete=models.CASCADE)
    title = models.CharField(max_length=200, help_text='演習課題タイトル')
    description = models.TextField(help_text='HTML形式の課題指示文')
    template = models.TextField(help_text='初期スターターコード')
    test_cases = models.JSONField(default=list, help_text='テストケース配列')
    setup_code = models.TextField(blank=True, default='', help_text='テスト前準備コード')
    solution_code = models.TextField(blank=True, default='', help_text='模範解答コード')
    explanation = models.TextField(blank=True, default='', help_text='解答の解説')

    def __str__(self):
        return f"演習: {self.lesson.title} - {self.title}"


class UserLearningProgress(models.Model):
    user_identifier = models.CharField(max_length=100, default='anonymous')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    is_skipped_by_assessment = models.BooleanField(default=False, help_text='実力診断で習得済み判定されたか')
    exercise_passed = models.BooleanField(default=False)
    saved_code = models.TextField(blank=True, default='')
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user_identifier', 'lesson')

    def __str__(self):
        status = "マスター済" if self.is_skipped_by_assessment else ("完了" if self.is_completed else "学習中")
        return f"{self.user_identifier} - {self.lesson.title}: {status}"
