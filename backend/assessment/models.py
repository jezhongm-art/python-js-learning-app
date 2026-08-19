from django.db import models
import uuid

class AssessmentProblem(models.Model):
    CATEGORY_CHOICES = [
        ('basic', '基本文法・型・計算'),
        ('control', '制御構文・ループ・条件分岐'),
        ('data_structure', 'リスト・辞書・データ構造'),
        ('library', '実用標準ライブラリ (datetime, math, re等)'),
        ('plot', 'データ可視化 (Matplotlib)'),
        ('algorithm', 'アルゴリズム・クラス設計'),
    ]

    LEVEL_CHOICES = [
        (1, 'レベル1: 基礎・入門'),
        (2, 'レベル2: 基礎制御・リスト'),
        (3, 'レベル3: 関数・応用データ構造・標準ライブラリ'),
        (4, 'レベル4: 実践可視化・アルゴリズム・設計'),
    ]

    problem_type = models.CharField(
        max_length=20,
        choices=[('function', '関数型'), ('cli', '対話型CLI'), ('plot', 'Matplotlibグラフ')],
        default='function'
    )
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='basic')
    order = models.IntegerField(default=1)
    title = models.CharField(max_length=255)
    description = models.TextField(help_text='HTML形式の問題文')
    template = models.TextField(help_text='出題用スターターコード')
    test_cases = models.JSONField(default=list, help_text='テストケース配列')
    setup_code = models.TextField(blank=True, default='', help_text='テスト前実行コード')
    
    # 段階的ヒント & 模範解答
    hint_1 = models.TextField(blank=True, default='', help_text='方針・考え方のヒント (1段階目)')
    hint_2 = models.TextField(blank=True, default='', help_text='具体的な関数・文法のヒント (2段階目)')
    model_answer = models.TextField(blank=True, default='', help_text='模範解答コード')
    model_answer_explanation = models.TextField(blank=True, default='', help_text='模範解答の丁寧な解説')
    
    weight = models.IntegerField(default=10, help_text='基本配点')

    class Meta:
        ordering = ['level', 'order']

    def __str__(self):
        return f"[Lv.{self.level}] {self.title} ({self.get_category_display()})"


class AssessmentSession(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user_identifier = models.CharField(max_length=100, default='anonymous')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    # 診断結果スコア
    total_score = models.FloatField(default=0.0, help_text='総合スコア (0-100)')
    self_reliance_score = models.FloatField(default=100.0, help_text='自力解決力スコア (0-100%)')
    category_scores = models.JSONField(default=dict, help_text='カテゴリ別習熟度スコア {category: score}')
    
    # 推奨カリキュラム
    recommended_chapter = models.IntegerField(default=1, help_text='推奨学習開始章 (1-8)')
    ai_feedback = models.TextField(blank=True, default='', help_text='AIによる診断総評・弱点アドバイス')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Session {self.session_id} - Score: {self.total_score} (Self-Reliance: {self.self_reliance_score}%)"


class ProblemAttemptLog(models.Model):
    session = models.ForeignKey(AssessmentSession, related_name='attempts', on_delete=models.CASCADE)
    problem = models.ForeignKey(AssessmentProblem, on_delete=models.CASCADE)
    is_passed = models.BooleanField(default=False)
    
    # 行動追跡メトリクス
    hint_count = models.IntegerField(default=0, help_text='ヒント閲覧回数 (0, 1, 2)')
    model_answer_viewed = models.BooleanField(default=False, help_text='模範解答を閲覧したか')
    attempt_count = models.IntegerField(default=0, help_text='テスト実行試行回数')
    duration_seconds = models.IntegerField(default=0, help_text='解答所要時間(秒)')
    user_code = models.TextField(blank=True, default='')
    
    earned_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('session', 'problem')

    def calculate_score(self):
        """自力度に応じたスコアリング計算"""
        if not self.is_passed:
            self.earned_score = 0.0
            return 0.0

        if self.model_answer_viewed:
            self.earned_score = self.problem.weight * 0.2
        elif self.hint_count == 1:
            self.earned_score = self.problem.weight * 0.7
        elif self.hint_count >= 2:
            self.earned_score = self.problem.weight * 0.4
        else:
            self.earned_score = float(self.problem.weight)

        return self.earned_score
