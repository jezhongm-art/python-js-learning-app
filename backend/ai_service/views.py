from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import json
import urllib.request

class AiLearningAdviceView(APIView):
    """実力診断結果に基づいてGemini 3.7によるパーソナライズ学習アドバイスを生成"""
    def post(self, request):
        api_key = request.data.get('api_key') or os.environ.get('GEMINI_API_KEY', '')
        session_data = request.data.get('session_data', {})
        
        score = session_data.get('total_score', 0)
        self_reliance = session_data.get('self_reliance_score', 100)
        categories = session_data.get('category_scores', {})
        recommended_chapter = session_data.get('recommended_chapter', 1)

        category_summary_text = "\n".join([
            f"- {cat_info.get('name')}: {cat_info.get('score_pct')}% ({cat_info.get('earned')}/{cat_info.get('max')}点)"
            for cat_key, cat_info in categories.items()
        ])

        system_prompt = "あなたは非常に親切で洞察力に優れたプロのPython指導メンターです。"
        user_prompt = f"""
受講生の実力診断結果が届きました。以下の診断メトリクスを多角的に分析し、温かくモチベーションを高める詳細な学習アドバイスを提供してください。

【受講生の実力診断メトリクス】
・総合スコア: {score}点 (100点満点)
・自力達成度: {self_reliance}% (ヒント・模範解答に頼らず自力で解けた割合)
・カテゴリ別習熟度:
{category_summary_text}
・システム推奨スタート章: 第{recommended_chapter}章

【回答に含めるべき内容】
1. **診断サマリーと受講生の強みの賞賛**: 自力解決力や高得点分野を具体的に褒める
2. **弱点分野の分析とつまずき防止のコツ**: スコアが低かったカテゴリ（またはヒント多用分野）へのピンポイントな学習アドバイス
3. **第{recommended_chapter}章からのおすすめ学習ロードマップ**: 教科書モードでどうステップアップしていくか
"""

        # APIキーが渡されている場合はGemini 3.7 APIを直接呼び出す
        if api_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]
                    }],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 1000,
                    }
                }
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    advice_text = resp_data['candidates'][0]['content']['parts'][0]['text']
                    return Response({'advice': advice_text})
            except Exception as e:
                pass

        # フォールバック（APIキー未設定またはエラー時）
        fallback_advice = (
            f"総合スコア {score}点、自力達成度 {self_reliance}% という素晴らしい結果です！\n\n"
            f"得意分野をさらに伸ばしつつ、第{recommended_chapter}章の教科書カリキュラムから学習を進めることで、"
            f"自力でコーディングできる応用力が着実に身につきます。一歩ずつクリアしていきましょう！"
        )
        return Response({'advice': fallback_advice})
