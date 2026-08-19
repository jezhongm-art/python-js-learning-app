from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import AssessmentProblem, AssessmentSession, ProblemAttemptLog
from .serializers import (
    AssessmentProblemSerializer,
    AssessmentSessionSerializer,
    ProblemAttemptLogSerializer
)

class StartAssessmentView(APIView):
    """新規の実力診断セッションを開始し、診断問題リストを返却"""
    def post(self, request):
        user_identifier = request.data.get('user_identifier', 'anonymous')
        session = AssessmentSession.objects.create(user_identifier=user_identifier)
        
        # 診断用の標準問題セットを取得
        problems = AssessmentProblem.objects.all().order_by('level', 'order')
        problem_data = AssessmentProblemSerializer(problems, many=True).data

        return Response({
            'session_id': str(session.session_id),
            'user_identifier': session.user_identifier,
            'total_problems': len(problem_data),
            'problems': problem_data
        }, status=status.HTTP_201_CREATED)


class RequestHintView(APIView):
    """段階的ヒントを要求し、利用ログを記録"""
    def post(self, request):
        session_id = request.data.get('session_id')
        problem_id = request.data.get('problem_id')
        hint_level = int(request.data.get('hint_level', 1)) # 1 or 2

        session = get_object_or_404(AssessmentSession, session_id=session_id)
        problem = get_object_or_404(AssessmentProblem, id=problem_id)

        attempt, _ = ProblemAttemptLog.objects.get_or_create(session=session, problem=problem)
        attempt.hint_count = max(attempt.hint_count, hint_level)
        attempt.save()

        hint_text = problem.hint_1 if hint_level == 1 else problem.hint_2
        if not hint_text:
            hint_text = f"【ヒント {hint_level}】仕様書とテストケースの入出力をもう一度確認してみましょう。"

        return Response({
            'problem_id': problem.id,
            'hint_level': hint_level,
            'hint_text': hint_text,
            'current_hint_count': attempt.hint_count
        })


class RequestModelAnswerView(APIView):
    """模範解答の閲覧を要求し、利用ログを記録"""
    def post(self, request):
        session_id = request.data.get('session_id')
        problem_id = request.data.get('problem_id')

        session = get_object_or_404(AssessmentSession, session_id=session_id)
        problem = get_object_or_404(AssessmentProblem, id=problem_id)

        attempt, _ = ProblemAttemptLog.objects.get_or_create(session=session, problem=problem)
        attempt.model_answer_viewed = True
        attempt.save()

        return Response({
            'problem_id': problem.id,
            'model_answer': problem.model_answer,
            'explanation': problem.model_answer_explanation,
            'model_answer_viewed': True
        })


class SubmitProblemAttemptView(APIView):
    """1問の解答結果・試行メトリクスを記録"""
    def post(self, request):
        session_id = request.data.get('session_id')
        problem_id = request.data.get('problem_id')
        is_passed = bool(request.data.get('is_passed', False))
        user_code = request.data.get('user_code', '')
        duration_seconds = int(request.data.get('duration_seconds', 0))
        attempt_increment = int(request.data.get('attempt_count', 1))

        session = get_object_or_404(AssessmentSession, session_id=session_id)
        problem = get_object_or_404(AssessmentProblem, id=problem_id)

        attempt, _ = ProblemAttemptLog.objects.get_or_create(session=session, problem=problem)
        attempt.is_passed = is_passed
        attempt.user_code = user_code
        attempt.duration_seconds += duration_seconds
        attempt.attempt_count += attempt_increment
        
        # スコア計算
        earned = attempt.calculate_score()
        attempt.save()

        return Response({
            'problem_id': problem.id,
            'is_passed': attempt.is_passed,
            'earned_score': earned,
            'hint_count': attempt.hint_count,
            'model_answer_viewed': attempt.model_answer_viewed
        })


class CompleteAssessmentView(APIView):
    """実力診断を完了し、総合スコア・自力解決度・カテゴリ別分析・推奨カリキュラムを算出"""
    def post(self, request):
        session_id = request.data.get('session_id')
        session = get_object_or_404(AssessmentSession, session_id=session_id)

        attempts = ProblemAttemptLog.objects.filter(session=session).select_related('problem')
        all_problems = AssessmentProblem.objects.all()

        total_max_weight = sum(p.weight for p in all_problems) or 1
        total_earned_score = sum(a.earned_score for a in attempts)
        
        # 1. 総合得点 (100点満点換算)
        overall_score_pct = round((total_earned_score / total_max_weight) * 100, 1)

        # 2. 自力達成度スコア (Self-Reliance Score):
        # 正解した問題のうち、ヒント・模範解答なしで解けた割合
        passed_attempts = [a for a in attempts if a.is_passed]
        if passed_attempts:
            fully_independent = sum(1 for a in passed_attempts if a.hint_count == 0 and not a.model_answer_viewed)
            self_reliance_pct = round((fully_independent / len(passed_attempts)) * 100, 1)
        else:
            self_reliance_pct = 0.0

        # 3. カテゴリ別習熟度スコアの集計
        category_map = {
            'basic': {'earned': 0.0, 'max': 0.0, 'name': '基本文法・型・計算'},
            'control': {'earned': 0.0, 'max': 0.0, 'name': '制御構文・ループ・条件分岐'},
            'data_structure': {'earned': 0.0, 'max': 0.0, 'name': 'リスト・辞書・データ構造'},
            'library': {'earned': 0.0, 'max': 0.0, 'name': '実用標準ライブラリ'},
            'plot': {'earned': 0.0, 'max': 0.0, 'name': 'データ可視化 (Matplotlib)'},
            'algorithm': {'earned': 0.0, 'max': 0.0, 'name': 'アルゴリズム・クラス設計'},
        }

        for p in all_problems:
            cat = p.category if p.category in category_map else 'basic'
            category_map[cat]['max'] += p.weight

        for a in attempts:
            cat = a.problem.category if a.problem.category in category_map else 'basic'
            category_map[cat]['earned'] += a.earned_score

        category_scores_result = {}
        weak_categories = []
        strong_categories = []

        for cat_key, cat_data in category_map.items():
            max_w = cat_data['max'] or 10
            pct = round((cat_data['earned'] / max_w) * 100, 1)
            category_scores_result[cat_key] = {
                'name': cat_data['name'],
                'score_pct': pct,
                'earned': cat_data['earned'],
                'max': cat_data['max']
            }
            if pct < 60.0:
                weak_categories.append(cat_data['name'])
            elif pct >= 80.0:
                strong_categories.append(cat_data['name'])

        # 4. 推奨学習章の自動決定
        # カテゴリスコアに基づいて最適な章（1〜8）を決定
        if category_scores_result['basic']['score_pct'] < 70:
            recommended_chapter = 1 # 第1章: 入門とデータ型
        elif category_scores_result['control']['score_pct'] < 70:
            recommended_chapter = 2 # 第2章: 条件分岐とループ
        elif category_scores_result['data_structure']['score_pct'] < 70:
            recommended_chapter = 4 # 第4章: 高度なデータ構造
        elif category_scores_result['library']['score_pct'] < 70:
            recommended_chapter = 5 # 第5章: 実用標準ライブラリ
        elif category_scores_result['plot']['score_pct'] < 70:
            recommended_chapter = 6 # 第6章: Matplotlibデータ可視化
        elif category_scores_result['algorithm']['score_pct'] < 70:
            recommended_chapter = 7 # 第7章: オブジェクト指向・クラス設計
        else:
            recommended_chapter = 8 # 第8章: 実践アルゴリズムと効率化

        # 5. AI講評サマリーの自動生成
        weak_text = "、".join(weak_categories) if weak_categories else "特になし（全体的にバランス良く習得されています）"
        strong_text = "、".join(strong_categories) if strong_categories else "基礎を着実に伸ばしましょう"

        ai_feedback = (
            f"【実力診断総評】\n"
            f"総合スコア: {overall_score_pct}点 / 自力達成度: {self_reliance_pct}%\n"
            f"・得意分野: {strong_text}\n"
            f"・重点強化分野: {weak_text}\n"
            f"あなたに最適な学習スタート地点は「第{recommended_chapter}章」です。教科書学習モードでステップアップしていきましょう！"
        )

        session.total_score = overall_score_pct
        session.self_reliance_score = self_reliance_pct
        session.category_scores = category_scores_result
        session.recommended_chapter = recommended_chapter
        session.ai_feedback = ai_feedback
        session.is_completed = True
        session.completed_at = timezone.now()
        session.save()

        # カリキュラム側のスキップ判定連動（高得点カテゴリはマスターフラグ付与）
        from curriculum.models import Chapter, Lesson, UserLearningProgress
        mastered_chapters = []
        if category_scores_result['basic']['score_pct'] >= 90:
            mastered_chapters.extend([1, 2])
        if category_scores_result['control']['score_pct'] >= 90:
            mastered_chapters.append(3)
        if category_scores_result['data_structure']['score_pct'] >= 90:
            mastered_chapters.append(4)
        if category_scores_result['library']['score_pct'] >= 90:
            mastered_chapters.append(5)
        if category_scores_result['plot']['score_pct'] >= 90:
            mastered_chapters.append(6)

        for ch_order in mastered_chapters:
            try:
                ch = Chapter.objects.get(order=ch_order)
                for lesson in ch.lessons.all():
                    prog, _ = UserLearningProgress.objects.get_or_create(
                        user_identifier=session.user_identifier,
                        lesson=lesson
                    )
                    prog.is_completed = True
                    prog.is_skipped_by_assessment = True
                    prog.save()
            except Chapter.DoesNotExist:
                pass

        return Response(AssessmentSessionSerializer(session).data)


class GetSessionSummaryView(APIView):
    """過去の診断結果を取得"""
    def get(self, request, session_id):
        session = get_object_or_404(AssessmentSession, session_id=session_id)
        return Response(AssessmentSessionSerializer(session).data)
