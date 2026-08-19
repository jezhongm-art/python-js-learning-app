from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from assessment.models import AssessmentProblem, AssessmentSession, ProblemAttemptLog
from curriculum.models import Chapter, Lesson

class AssessmentApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.prob1 = AssessmentProblem.objects.create(
            level=1,
            category='basic',
            order=1,
            title='Test Problem 1',
            description='Test Desc 1',
            template='def test(): pass',
            test_cases=[{'input': 'test()', 'expected': 1}],
            hint_1='Hint 1',
            hint_2='Hint 2',
            model_answer='def test(): return 1',
            weight=10
        )

    def test_start_assessment(self):
        url = reverse('assessment-start')
        resp = self.client.post(url, {'user_identifier': 'user_123'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn('session_id', resp.data)
        self.assertEqual(resp.data['total_problems'], 1)

    def test_hint_and_score_tracking(self):
        # 診断開始
        start_resp = self.client.post(reverse('assessment-start'), {'user_identifier': 'user_123'}, format='json')
        session_id = start_resp.data['session_id']

        # ヒント1要求
        hint_resp = self.client.post(reverse('assessment-hint'), {
            'session_id': session_id,
            'problem_id': self.prob1.id,
            'hint_level': 1
        }, format='json')
        self.assertEqual(hint_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(hint_resp.data['hint_text'], 'Hint 1')

        # 解答提出 (合格)
        submit_resp = self.client.post(reverse('assessment-submit'), {
            'session_id': session_id,
            'problem_id': self.prob1.id,
            'is_passed': True,
            'user_code': 'def test(): return 1',
            'duration_seconds': 45
        }, format='json')
        self.assertEqual(submit_resp.status_code, status.HTTP_200_OK)
        # ヒント1回利用なので 10 * 0.7 = 7.0点
        self.assertEqual(submit_resp.data['earned_score'], 7.0)

        # 完了
        comp_resp = self.client.post(reverse('assessment-complete'), {
            'session_id': session_id
        }, format='json')
        self.assertEqual(comp_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(comp_resp.data['total_score'], 70.0)
        self.assertEqual(comp_resp.data['self_reliance_score'], 0.0) # ヒントを使ったので自力100%ではない
