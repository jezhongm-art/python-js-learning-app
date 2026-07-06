      window.brythonTestResult = null;

      // ==========================================
      // テーマ切り替え (Dark / Light Mode)
      // ==========================================
      const themeToggleBtn = document.getElementById("theme-toggle-btn");
      const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
      const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
      const themeToggleText = document.getElementById("theme-toggle-text");

      function syncThemeUI() {
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark) {
          themeToggleDarkIcon.classList.add("hidden");
          themeToggleLightIcon.classList.remove("hidden");
          themeToggleText.textContent = "ライトモード";
        } else {
          themeToggleDarkIcon.classList.remove("hidden");
          themeToggleLightIcon.classList.add("hidden");
          themeToggleText.textContent = "ダークモード";
        }
      }

      if (themeToggleBtn) {
        syncThemeUI();
        themeToggleBtn.addEventListener("click", () => {
          document.documentElement.classList.toggle("dark");
          const isDark = document.documentElement.classList.contains("dark");
          localStorage.setItem("theme", isDark ? "dark" : "light");
          syncThemeUI();
        });
      }

      // ==========================================
      // カスタムモーダル・確認用ダイアログ
      // ==========================================
      const appModal = document.getElementById("app-modal");
      const appModalTitle = document.getElementById("app-modal-title");
      const appModalMessage = document.getElementById("app-modal-message");
      const appModalClose = document.getElementById("app-modal-close");
      const modalIconContainer = document.getElementById(
        "modal-icon-container",
      );

      function notify(message, title = "お知らせ", type = "info") {
        appModalTitle.textContent = title;
        appModalMessage.textContent = message;

        if (type === "error") {
          modalIconContainer.className =
            "p-2 bg-rose-50 text-rose-600 rounded-lg";
          modalIconContainer.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        `;
          appModalClose.className =
            "bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors";
        } else {
          modalIconContainer.className =
            "p-2 bg-indigo-50 text-indigo-600 rounded-lg";
          modalIconContainer.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
          appModalClose.className =
            "bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors";
        }

        appModal.classList.remove("hidden");
      }

      appModalClose.onclick = () => {
        appModal.classList.add("hidden");
      };

      // ESCキーでモーダルを閉じる
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (!appModal.classList.contains("hidden"))
            appModal.classList.add("hidden");
          if (!confirmModal.classList.contains("hidden")) {
            confirmModal.classList.add("hidden");
            confirmCallback = null;
          }
        }
      });

      // ==========================================
      // セキュリティユーティリティ
      // ==========================================
      function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = String(str);
        return div.innerHTML;
      }

      function sanitizeHtml(html) {
        if (typeof DOMPurify !== "undefined") {
          return DOMPurify.sanitize(html);
        }
        return escapeHtml(html);
      }

      const confirmModal = document.getElementById("confirm-modal");
      const confirmModalCancel = document.getElementById(
        "confirm-modal-cancel",
      );
      const confirmModalOk = document.getElementById("confirm-modal-ok");
      let confirmCallback = null;

      function askConfirm(callback) {
        confirmCallback = callback;
        confirmModal.classList.remove("hidden");
      }

      confirmModalCancel.onclick = () => {
        confirmModal.classList.add("hidden");
        confirmCallback = null;
      };

      confirmModalOk.onclick = () => {
        confirmModal.classList.add("hidden");
        if (confirmCallback) confirmCallback();
        confirmCallback = null;
      };

      // ==========================================
      // APIキー管理ロジック (localStorage連携)
      // ==========================================
      const apiKeyToggleBtn = document.getElementById("api-key-toggle-btn");
      const apiKeyPanel = document.getElementById("api-key-panel");
      const apiKeyInput = document.getElementById("api-key-input");
      const apiKeySaveBtn = document.getElementById("api-key-save-btn");
      const apiKeyClearBtn = document.getElementById("api-key-clear-btn");
      const apiKeyStatus = document.getElementById("api-key-status");

      apiKeyToggleBtn.onclick = () => {
        apiKeyPanel.classList.toggle("hidden");
      };

      function updateKeyStatus() {
        const savedKey = localStorage.getItem("gemini_api_key");
        if (savedKey) {
          apiKeyInput.value = savedKey;
          apiKeyStatus.className =
            "text-xs flex items-center gap-1 text-emerald-600 font-semibold";
          apiKeyStatus.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          APIキーが保存されています (Gemini 3.5 Flash で稼働中)
        `;
          apiKeyStatus.classList.remove("hidden");
        } else {
          apiKeyInput.value = "";
          apiKeyStatus.className =
            "text-xs flex items-center gap-1 text-amber-600 font-semibold";
          apiKeyStatus.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          キー未設定 (ローカルでAI機能を使用するには設定が必要です)
        `;
          apiKeyStatus.classList.remove("hidden");
        }
      }

      apiKeySaveBtn.onclick = () => {
        const key = apiKeyInput.value.trim();
        if (!key) {
          notify("有効なAPIキーを入力してください。", "入力エラー", "info");
          return;
        }
        localStorage.setItem("gemini_api_key", key);
        updateKeyStatus();
        notify(
          "APIキーを保存しました！ローカルでAI問題生成が利用できます。",
          "保存成功",
          "info",
        );
        apiKeyPanel.classList.add("hidden");
      };

      apiKeyClearBtn.onclick = () => {
        localStorage.removeItem("gemini_api_key");
        updateKeyStatus();
        notify(
          "APIキーを削除しました。AI機能の実行が停止します。",
          "クリア完了",
          "info",
        );
      };

      updateKeyStatus();

      // ==========================================
      // 進捗 & バッジ管理ロジック (localStorage)
      // ==========================================
      const PROGRESS_KEY = "python_learning_progress_v2_ultimate";

      let learningProgress = {
        totalQuizzesAnswered: 0,
        highestQuizScore: 0,
        completedProblems: [], // タイトルリスト
        aiChallengesCleared: 0,
      };

      function loadProgress() {
        const saved = localStorage.getItem(PROGRESS_KEY);
        if (saved) {
          try {
            learningProgress = { ...learningProgress, ...JSON.parse(saved) };
          } catch (e) {
            console.error("進捗データのパースエラー:", e);
          }
        }
        updateDashboardUI();
      }

      function saveProgress() {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(learningProgress));
        updateDashboardUI();
      }

      function updateDashboardUI() {
        // 各種ステータスの表示更新
        document.getElementById("stat-quizzes").textContent =
          learningProgress.totalQuizzesAnswered;
        document.getElementById("stat-coding").textContent =
          learningProgress.completedProblems.length;
        document.getElementById("stat-ai-gen").textContent =
          learningProgress.aiChallengesCleared;

        // 条件に基づく称号・バッジ決定
        let rank = "🐍 Pythonビギナー";
        let badges = [];

        if (learningProgress.totalQuizzesAnswered > 0) {
          rank = "💡 クイズ挑戦者";
        }
        if (learningProgress.highestQuizScore >= 5) {
          badges.push("⚡ 爆速クイズ王");
        }
        if (learningProgress.completedProblems.length > 0) {
          rank = "💻 駆け出しプログラマー";
        }
        if (learningProgress.aiChallengesCleared > 0) {
          badges.push("🧠 AIチャレンジャー");
        }
        if (learningProgress.completedProblems.length >= 10) {
          rank = "🏆 アルゴリズムマスター";
          badges.push("👑 Pythonicエキスパート");
        }

        const badgeString =
          badges.length > 0 ? ` [バッジ: ${badges.join(", ")}]` : "";
        document.getElementById("dashboard-rank").textContent =
          `${rank}${badgeString}`;
      }

      // 起動時にロード
      loadProgress();

      // ==========================================
      // 配列のシャッフル関数
      // ==========================================
      function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      }

      // ==========================================
      // 4択クイズ用データ (完全版 49問)
      // ==========================================
      const rawQuizQuestions = [
        {
          question:
            "Pythonで変数名として使用できない（構文エラーになる）命名はどれか？",
          options: ["2nd_value", "_value", "value2", "value_name"],
          correctAnswer: "2nd_value",
        },
        {
          question: "Pythonでべき乗（累乗）の計算を行うための演算子はどれか？",
          options: ["**", "^", "^^", "pow"],
          correctAnswer: "**",
        },
        {
          question: "Pythonで標準出力に文字列を表示する関数はどれか？",
          options: ["print()", "echo()", "log()", "output()"],
          correctAnswer: "print()",
        },
        {
          question: "次のうち、Pythonの整数型を表すキーワードはどれか？",
          options: ["int", "float", "str", "bool"],
          correctAnswer: "int",
        },
        {
          question: "Pythonで文字列を整数に変換する関数はどれか？",
          options: ["int()", "str()", "float()", "bool()"],
          correctAnswer: "int()",
        },
        {
          question:
            "Pythonのif文において、条件が偽（False）の場合にさらに別の条件を検査するためのキーワードはどれか？",
          options: ["elif", "else if", "elseif", "elsif"],
          correctAnswer: "elif",
        },
        {
          question: "組み込み関数 range(5) が生成する整数の範囲はどれか？",
          options: [
            "0 から 4 まで",
            "0 から 5 まで",
            "1 から 5 まで",
            "1 から 4 まで",
          ],
          correctAnswer: "0 から 4 まで",
        },
        {
          question:
            "ループ処理の途中で、それ以降の処理をスキップして次の繰り返し（イテレーション）に進めるためのキーワードはどれか？",
          options: ["continue", "break", "pass", "skip"],
          correctAnswer: "continue",
        },
        {
          question: "Pythonのリストの末尾に要素を追加するメソッドはどれか？",
          options: ["append()", "add()", "insert()", "push()"],
          correctAnswer: "append()",
        },
        {
          question:
            "Pythonでリストの要素をインプレースでソートするメソッドはどれか？",
          options: [
            "list.sort()",
            "list.order()",
            "list.sorted()",
            "list.arrange()",
          ],
          correctAnswer: "list.sort()",
        },
        {
          question:
            "Pythonで辞書（dictionary）のキーと値のペアを追加または更新するメソッドはどれか？",
          options: [
            "dict.update()",
            "dict.add()",
            "dict.insert()",
            "dict.append()",
          ],
          correctAnswer: "dict.update()",
        },
        {
          question:
            "Pythonのリストから重複を取り除いて一意の値にするために最も適したデータ構造はどれか？",
          options: ["set", "tuple", "dict", "frozenset"],
          correctAnswer: "set",
        },
        {
          question: "Pythonで関数を定義するキーワードはどれか？",
          options: ["def", "function", "func", "define"],
          correctAnswer: "def",
        },
        {
          question:
            "Pythonで他のモジュールをインポートするキーワードはどれか？",
          options: ["import", "include", "require", "using"],
          correctAnswer: "import",
        },
        {
          question:
            "Pythonでファイルを読み込みモードで開く際のモード指定文字はどれか？",
          options: ["r", "w", "a", "x"],
          correctAnswer: "r",
        },
        {
          question: "Pythonで例外をキャッチして処理を行うための構文はどれか？",
          options: ["try-except", "try-catch", "catch", "exception"],
          correctAnswer: "try-except",
        },
        {
          question: "Pythonでクラスを定義するキーワードはどれか？",
          options: ["class", "def", "struct", "object"],
          correctAnswer: "class",
        },
        {
          question:
            "Pythonのクラスにおいて、インスタンス作成時に自動的に呼び出される初期化メソッドの名前はどれか？",
          options: ["__init__", "__new__", "constructor", "initialize"],
          correctAnswer: "__init__",
        },
        {
          question:
            "リスト内包表記 [x * 2 for x in range(3)] の結果として正しいリストはどれか？",
          options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[0, 2, 4, 6]"],
          correctAnswer: "[0, 2, 4]",
        },
        {
          question:
            "辞書やリストなどのオブジェクトの要素数を取得するための組み込み関数はどれか？",
          options: ["len()", "size()", "count()", "length()"],
          correctAnswer: "len()",
        },
        {
          question: "Pythonで論理否定（NOT）を表す演算子はどれか？",
          options: ["not", "!", "~", "None"],
          correctAnswer: "not",
        },
        {
          question: "Pythonで文字列を浮動小数点数に変換する関数はどれか？",
          options: ["float()", "int()", "str()", "parse()"],
          correctAnswer: "float()",
        },
        {
          question:
            "Pythonでループの現在のインデックスを取得するために、組み込み関数 range() と一緒に使う関数はどれか？",
          options: ["enumerate()", "index()", "range()", "zip()"],
          correctAnswer: "enumerate()",
        },
        {
          question: "Pythonでリストの先頭に要素を追加するメソッドはどれか？",
          options: [
            "insert(0, element)",
            "prepend(element)",
            "add_first(element)",
            "push_front(element)",
          ],
          correctAnswer: "insert(0, element)",
        },
        {
          question: "Pythonでリストを逆順にするメソッドはどれか？",
          options: ["reverse()", "reversed()", "sort(reverse=True)", "flip()"],
          correctAnswer: "reverse()",
        },
        {
          question: "Pythonで辞書のすべてのキーを取得するメソッドはどれか？",
          options: ["keys()", "get_keys()", "items()", "values()"],
          correctAnswer: "keys()",
        },
        {
          question: "Pythonで辞書のすべての値を取得するメソッドはどれか？",
          options: ["values()", "get_values()", "items()", "keys()"],
          correctAnswer: "values()",
        },
        {
          question: "Pythonで辞書のキーと値のペアを取得するメソッドはどれか？",
          options: ["items()", "pairs()", "entries()", "get_items()"],
          correctAnswer: "items()",
        },
        {
          question:
            "Pythonでリストの最後の要素を削除して返すメソッドはどれか？",
          options: ["pop()", "remove_last()", "delete_last()", "pop_last()"],
          correctAnswer: "pop()",
        },
        {
          question: "Pythonでリストから特定の要素を削除するメソッドはどれか？",
          options: ["remove()", "delete()", "pop()", "discard()"],
          correctAnswer: "remove()",
        },
        {
          question:
            "Pythonでリストの特定の位置の要素を削除するメソッドはどれか？",
          options: [
            "pop(index)",
            "remove(index)",
            "delete(index)",
            "discard(index)",
          ],
          correctAnswer: "pop(index)",
        },
        {
          question: "Pythonでリストの要素を昇順にソートするメソッドはどれか？",
          options: ["sort()", "sorted()", "order()", "arrange()"],
          correctAnswer: "sort()",
        },
        {
          question: "Pythonでリストの要素を降順にソートするメソッドはどれか？",
          options: [
            "sort(reverse=True)",
            "sorted(reverse=True)",
            "reverse_sort()",
            "descending()",
          ],
          correctAnswer: "sort(reverse=True)",
        },
        {
          question:
            "Pythonでリストの要素をソートした新しいリストを返す関数はどれか？",
          options: ["sorted()", "sort()", "order()", "arrange()"],
          correctAnswer: "sorted()",
        },
        {
          question: "Python'でリストの要素をコピーするメソッドはどれか？",
          options: ["copy()", "clone()", "dup()", "replicate()"],
          correctAnswer: "copy()",
        },
        {
          question: "Pythonでリストの要素をすべて削除するメソッドはどれか？",
          options: ["clear()", "empty()", "remove_all()", "delete_all()"],
          correctAnswer: "clear()",
        },
        {
          question: "Pythonでリストの要素を拡張するメソッドはどれか？",
          options: ["extend()", "append()", "add()", "push()"],
          correctAnswer: "extend()",
        },
        {
          question: "Pythonでリストの要素をカウントするメソッドはどれか？",
          options: ["count()", "len()", "size()", "length()"],
          correctAnswer: "count()",
        },
        {
          question:
            "Pythonでリストの要素のインデックスを取得するメソッドはどれか？",
          options: ["index()", "find()", "search()", "locate()"],
          correctAnswer: "index()",
        },
        {
          question: "Pythonでリストの要素をスライスするための構文はどれか？",
          options: [
            "list[start:stop]",
            "list.slice(start, stop)",
            "list.sub(start, stop)",
            "list.range(start, stop)",
          ],
          correctAnswer: "list[start:stop]",
        },
        {
          question:
            "Pythonでリストの要素をスライスしてステップを指定する構文はどれか？",
          options: [
            "list[start:stop:step]",
            "list.slice(start, stop, step)",
            "list.sub(start, stop, step)",
            "list.range(start, stop, step)",
          ],
          correctAnswer: "list[start:stop:step]",
        },
        {
          question:
            "Pythonでリストの要素をスライスして逆順にする構文はどれか？",
          options: [
            "list[::-1]",
            "list.reverse()",
            "list.reversed()",
            "list.flip()",
          ],
          correctAnswer: "list[::-1]",
        },
        {
          question:
            "Pythonでリストの要素をスライスして最初の要素を取得する構文はどれか？",
          options: ["list[0]", "list.first()", "list.head()", "list[1]"],
          correctAnswer: "list[0]",
        },
        {
          question:
            "Pythonでリストの要素をスライスして最後の要素を取得する構文はどれか？",
          options: [
            "list[-1]",
            "list.last()",
            "list.tail()",
            "list[len(list)-1]",
          ],
          correctAnswer: "list[-1]",
        },
        {
          question:
            "Pythonでリストの要素をスライスして最後の要素を除いたすべての要素を取得する構文はどれか？",
          options: [
            "list[:-1]",
            "list[0:-1]",
            "list[0:len(list)-1]",
            "list[0:len(list)-1]",
          ],
          correctAnswer: "list[:-1]",
        },
        {
          question:
            "Pythonでリストの要素をスライスして最初の要素を除いたすべての要素を取得する構文はどれか？",
          options: [
            "list[1:]",
            "list[1:len(list)]",
            "list[1:len(list)]",
            "list[1:len(list)]",
          ],
          correctAnswer: "list[1:]",
        },
        {
          question:
            "Pythonでリストの要素をスライスして最初の2つの要素を取得する構文はどれか？",
          options: ["list[:2]", "list[0:2]", "list[0:2]", "list[0:2]"],
          correctAnswer: "list[:2]",
        },
        {
          question:
            "Pythonでリストの要素をスライスして最後の2つの要素を取得する構文はどれか？",
          options: [
            "list[-2:]",
            "list[len(list)-2:len(list)]",
            "list[len(list)-2:len(list)]",
            "list[len(list)-2:len(list)]",
          ],
          correctAnswer: "list[-2:]",
        },
      ];

      let quizQuestions = shuffleArray(rawQuizQuestions).map((q) => {
        const shuffledOptions = shuffleArray(q.options);
        const correctIndex = shuffledOptions.indexOf(q.correctAnswer);
        return {
          question: q.question,
          options: shuffledOptions,
          correctIndex: correctIndex,
          correctAnswer: q.correctAnswer,
          isAiGenerated: false,
        };
      });

      let currentQuizIndex = 0;
      let quizScore = 0;
      let quizUserAnswers = [];

      const quizQuestionContainer =
        document.getElementById("question-container");
      const quizOptionsContainer = document.getElementById("options-container");
      const quizNextBtn = document.getElementById("next-btn");
      const quizResultContainer = document.getElementById(
        "quiz-result-container",
      );
      const quizProgress = document.getElementById("quiz-progress");
      const quizTypeBadge = document.getElementById("quiz-type-badge");

      // ==========================================
      // クイズコントロール logic...
      // ==========================================
      function showQuizQuestion() {
        const q = quizQuestions[currentQuizIndex];
        quizProgress.textContent = `${currentQuizIndex + 1} / ${quizQuestions.length}`;
        quizQuestionContainer.innerHTML = `<p class="leading-relaxed font-semibold whitespace-pre-wrap">${sanitizeHtml(q.question)}</p>`;

        if (q.isAiGenerated) {
          quizTypeBadge.classList.remove("hidden");
        } else {
          quizTypeBadge.classList.add("hidden");
        }

        quizOptionsContainer.innerHTML = "";
        q.options.forEach((option, index) => {
          const btn = document.createElement("button");
          btn.textContent = option;
          btn.className =
            "w-full text-left px-5 py-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm";
          btn.onclick = () => selectQuizOption(index);
          quizOptionsContainer.appendChild(btn);
        });
        quizNextBtn.classList.add("hidden");
      }

      function selectQuizOption(selectedIndex) {
        const q = quizQuestions[currentQuizIndex];
        const buttons = quizOptionsContainer.querySelectorAll("button");

        buttons.forEach((btn, index) => {
          btn.disabled = true;
          btn.className =
            "w-full text-left px-5 py-4 border rounded-lg font-medium transition-all duration-150 focus:outline-none shadow-sm cursor-not-allowed ";
          if (index === q.correctIndex) {
            btn.classList.add(
              "bg-emerald-50",
              "dark:bg-emerald-950/30",
              "border-emerald-500",
              "dark:border-emerald-600",
              "text-emerald-800",
              "dark:text-emerald-300",
            );
          } else if (index === selectedIndex && index !== q.correctIndex) {
            btn.classList.add(
              "bg-rose-50",
              "dark:bg-rose-950/30",
              "border-rose-500",
              "dark:border-rose-600",
              "text-rose-800",
              "dark:text-rose-300",
            );
          } else {
            btn.classList.add(
              "bg-slate-50",
              "dark:bg-slate-800/50",
              "border-slate-200",
              "dark:border-slate-700",
              "text-slate-400",
              "dark:text-slate-500",
            );
          }
        });

        const isCorrect = selectedIndex === q.correctIndex;
        if (isCorrect) quizScore++;
        quizUserAnswers.push({
          question: q.question,
          selectedIndex,
          correctIndex: q.correctIndex,
          isCorrect,
        });
        quizNextBtn.classList.remove("hidden");
      }

      function nextQuiz() {
        currentQuizIndex++;
        if (currentQuizIndex < quizQuestions.length) {
          showQuizQuestion();
        } else {
          showQuizResult();
        }
      }

      function showQuizResult() {
        document.getElementById("quiz-container").classList.add("hidden");
        quizResultContainer.classList.remove("hidden");
        const rate = ((quizScore / quizQuestions.length) * 100).toFixed(1);

        // 学習進捗データ更新
        learningProgress.totalQuizzesAnswered += quizQuestions.length;
        if (quizScore > learningProgress.highestQuizScore) {
          learningProgress.highestQuizScore = quizScore;
        }
        // AI生成問題のクイズをクリアした場合
        const hasAiQuestion = quizQuestions.some((q) => q.isAiGenerated);
        if (hasAiQuestion && quizScore >= Math.ceil(quizQuestions.length / 2)) {
          learningProgress.aiChallengesCleared += 1;
        }
        saveProgress();

        quizResultContainer.innerHTML = `
        <div class="text-center space-y-3 pb-6 border-b border-slate-200">
          <h3 class="text-2xl font-bold text-slate-900">4択クイズ 結果発表</h3>
          <p class="text-sm text-slate-500 font-medium">お疲れ様でした！全問解答が完了しました。</p>
          <div class="flex justify-center gap-8 mt-4">
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600">${quizScore} / ${quizQuestions.length}</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">正解数</span>
            </div>
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600">${rate}%</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">正答率</span>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-slate-900">回答詳細履歴</h4>
          <div class="space-y-3 divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2">
            ${quizUserAnswers
              .map(
                (ans, idx) => `
              <div class="pt-4 first:pt-0">
                <div class="flex items-start justify-between gap-4">
                  <span class="font-semibold text-slate-700 text-sm sm:text-base whitespace-pre-wrap">${idx + 1}. ${ans.question}</span>
                  <span class="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${ans.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}">
                    ${ans.isCorrect ? "正解" : "不正解"}
                  </span>
                </div>
                <div class="mt-2 text-sm text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p>選択した答え: <span class="font-medium text-slate-800">${escapeHtml(quizQuestions[idx].options[ans.selectedIndex])}</span></p>
                  <p>正しい答え: <span class="font-medium text-slate-800">${escapeHtml(quizQuestions[idx].options[ans.correctIndex])}</span></p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        <div class="pt-6 flex justify-center">
          <button onclick="location.reload()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-colors">
            もう一度挑戦する
          </button>
        </div>
      `;
      }

      quizNextBtn.onclick = nextQuiz;

      // ==========================================
      // コーディング問題データ定義 (完全版 20問)
      // ==========================================
      const defaultCodingProblems = [
        {
          title: "1. 文字列の結合",
          description:
            "文字列の引数 <code>name</code> を受け取り、<code>'Hello, '</code> と <code>name</code> と <code>'!'</code> を結合した文字列を返す関数 <code>greet(name)</code> を実装してください。",
          template: `def greet(name):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: 'greet("Alice")', expected: "Hello, Alice!" },
            { input: 'greet("Bob")', expected: "Hello, Bob!" },
            { input: 'greet("")', expected: "Hello, !" },
          ],
        },
        {
          title: "2. 数値の二乗計算",
          description:
            "数値 <code>x</code> を受け取り、その二乗を返す関数 <code>square(x)</code> を実装してください。",
          template: `def square(x):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "square(2)", expected: 4 },
            { input: "square(5)", expected: 25 },
            { input: "square(0)", expected: 0 },
            { input: "square(-3)", expected: 9 },
          ],
        },
        {
          title: "3. 偶数判定関数",
          description:
            "整数 <code>n</code> を受け取り、<code>n</code> が偶数なら <code>True</code>、奇数なら <code>False</code> を返す関数 <code>is_even(n)</code> を実装してください。",
          template: `def is_even(n):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "is_even(2)", expected: true },
            { input: "is_even(3)", expected: false },
            { input: "is_even(0)", expected: true },
            { input: "is_even(-4)", expected: true },
            { input: "is_even(-7)", expected: false },
          ],
        },
        {
          title: "4. 最大値の取得",
          description:
            "2つの数値 <code>a</code> と <code>b</code> を受け取り、大きい方の値を返す関数 <code>get_max(a, b)</code> を実装してください。値が等しい場合はその値を返してください。",
          template: `def get_max(a, b):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "get_max(5, 3)", expected: 5 },
            { input: "get_max(2, 8)", expected: 8 },
            { input: "get_max(4, 4)", expected: 4 },
            { input: "get_max(-1, -5)", expected: -1 },
          ],
        },
        {
          title: "5. リストの合計",
          description:
            "数値のリスト <code>numbers</code> を受け取り、その合計を返す関数 <code>sum_list(numbers)</code> を実装してください。リストが空の場合は <code>0</code> を返してください。",
          template: `def sum_list(numbers):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "sum_list([1, 2, 3])", expected: 6 },
            { input: "sum_list([])", expected: 0 },
            { input: "sum_list([-1, 0, 1])", expected: 0 },
            { input: "sum_list([10])", expected: 10 },
          ],
        },
        {
          title: "6. 偶数のカウント",
          description:
            "整数のリスト <code>numbers</code> を受け取り、その中に含まれる偶数の個数を返す関数 <code>count_evens(numbers)</code> を実装してください。",
          template: `def count_evens(numbers):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "count_evens([1, 2, 3, 4, 5])", expected: 2 },
            { input: "count_evens([2, 4, 6])", expected: 3 },
            { input: "count_evens([1, 3, 5])", expected: 0 },
            { input: "count_evens([])", expected: 0 },
          ],
        },
        {
          title: "7. 文字列の反転",
          description:
            "文字列 <code>s</code> を受け取り、その文字列を反転したものを返す関数 <code>reverse_string(s)</code> を実装してください。",
          template: `def reverse_string(s):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: 'reverse_string("hello")', expected: "olleh" },
            { input: 'reverse_string("")', expected: "" },
            { input: 'reverse_string("a")', expected: "a" },
            { input: 'reverse_string("12345")', expected: "54321" },
          ],
        },
        {
          title: "8. 特定文字のカウント",
          description:
            "文字列 <code>s</code> と特定の文字 <code>char</code> を受け取り、文字列 <code>s</code> の中に <code>char</code> が出現する回数を返す関数 <code>count_char(s, char)</code> を実装してください。",
          template: `def count_char(s, char):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: 'count_char("hello", "l")', expected: 2 },
            { input: 'count_char("banana", "a")', expected: 3 },
            { input: 'count_char("python", "z")', expected: 0 },
            { input: 'count_char("", "a")', expected: 0 },
          ],
        },
        {
          title: "9. リストの最大値",
          description:
            "数値のリスト <code>numbers</code> を受け取り、その中で最大の値を返す関数 <code>get_max_value(numbers)</code> を実装してください。リストが空の場合は <code>None</code> を返してください。",
          template: `def get_max_value(numbers):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "get_max_value([1, 2, 3])", expected: 3 },
            { input: "get_max_value([])", expected: null },
            { input: "get_max_value([-1, -5, -3])", expected: -1 },
            { input: "get_max_value([10])", expected: 10 },
          ],
        },
        {
          title: "10. リストの最小値",
          description:
            "数値のリスト <code>numbers</code> を受け取り、その中で最小の値を返す関数 <code>get_min_value(numbers)</code> を実装してください。リストが空の場合は <code>None</code> を返してください。",
          template: `def get_min_value(numbers):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "get_min_value([1, 2, 3])", expected: 1 },
            { input: "get_min_value([])", expected: null },
            { input: "get_min_value([-1, -5, -3])", expected: -5 },
            { input: "get_min_value([10])", expected: 10 },
          ],
        },
        {
          title: "11. リストの平均値",
          description:
            "数値のリスト <code>numbers</code> を受け取り、その平均値を返す関数 <code>get_average(numbers)</code> を実装してください。リストが空の場合は <code>0</code> を返してください。",
          template: `def get_average(numbers):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "get_average([1, 2, 3])", expected: 2.0 },
            { input: "get_average([])", expected: 0 },
            { input: "get_average([10, 20, 30])", expected: 20.0 },
            { input: "get_average([5])", expected: 5.0 },
          ],
        },
        {
          title: "12. リストのフィルタリング",
          description:
            "数値のリスト <code>numbers</code> と閾値 <code>threshold</code> を受け取り、<code>threshold</code> 以上の値のみを含む新しいリストを返す関数 <code>filter_above(numbers, threshold)</code> を実装してください。",
          template: `def filter_above(numbers, threshold):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "filter_above([1, 2, 3, 4, 5], 3)", expected: [3, 4, 5] },
            { input: "filter_above([1, 2, 3], 5)", expected: [] },
            { input: "filter_above([], 1)", expected: [] },
            { input: "filter_above([10, 20, 30], 10)", expected: [10, 20, 30] },
          ],
        },
        {
          title: "13. リストのフィルタリング（以下）",
          description:
            "数値のリスト <code>numbers</code> と閾値 <code>threshold</code> を受け取り、<code>threshold</code> 以下の値のみを含む新しいリストを返す関数 <code>filter_below(numbers, threshold)</code> を実装してください。",
          template: `def filter_below(numbers, threshold):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: "filter_below([1, 2, 3, 4, 5], 3)", expected: [1, 2, 3] },
            { input: "filter_below([1, 2, 3], 0)", expected: [] },
            { input: "filter_below([], 1)", expected: [] },
            { input: "filter_below([10, 20, 30], 30)", expected: [10, 20, 30] },
          ],
        },
        {
          title: "14. リストの重複除去",
          description:
            "任意の型の要素を持つリスト <code>items</code> を受け取り、重複を除去した新しいリストを返す関数 <code>remove_duplicates(items)</code> を実装してください。順序は元のリストの出現順を維持してください。",
          template: `def remove_duplicates(items):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            {
              input: "remove_duplicates([1, 2, 2, 3, 3, 3])",
              expected: [1, 2, 3],
            },
            {
              input: 'remove_duplicates(["a", "b", "a", "c"])',
              expected: ["a", "b", "c"],
            },
            { input: "remove_duplicates([])", expected: [] },
            { input: "remove_duplicates([1, 1, 1])", expected: [1] },
          ],
        },
        {
          title: "15. 文字列の単語分割",
          description:
            "文字列 <code>s</code> を受け取り、空白文字で分割した単語のリストを返す関数 <code>split_words(s)</code> を実装してください。連続する空白は無視し、空文字列の場合は空リストを返してください。",
          template: `def split_words(s):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            {
              input: 'split_words("hello world")',
              expected: ["hello", "world"],
            },
            { input: 'split_words("  a   b  c  ")', expected: ["a", "b", "c"] },
            { input: 'split_words("")', expected: [] },
            { input: 'split_words("single")', expected: ["single"] },
          ],
        },
        {
          title: "16. 文字列の単語数カウント",
          description:
            "文字列 <code>s</code> を受け取り、その中に含まれる単語の数を返す関数 <code>count_words(s)</code> を実装してください。単語は空白文字で区切られた連続する非空白文字列とします。",
          template: `def count_words(s):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: 'count_words("hello world")', expected: 2 },
            { input: 'count_words("  a   b  c  ")', expected: 3 },
            { input: 'count_words("")', expected: 0 },
            { input: 'count_words("single")', expected: 1 },
          ],
        },
        {
          title: "17. 文字列の先頭大文字化",
          description:
            "文字列 <code>s</code> を受け取り、各単語の先頭文字を大文字に、それ以外を小文字に変換した文字列を返す関数 <code>capitalize_words(s)</code> を実装してください。単語は空白文字で区切られます。",
          template: `def capitalize_words(s):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            {
              input: 'capitalize_words("hello world")',
              expected: "Hello World",
            },
            { input: 'capitalize_words("  a   b  c  ")', expected: "A B C" },
            { input: 'capitalize_words("")', expected: "" },
            { input: 'capitalize_words("SINGLE")', expected: "Single" },
          ],
        },
        {
          title: "18. 文字列の部分文字列検索",
          description:
            "文字列 <code>s</code> と部分文字列 <code>sub</code> を受け取り、<code>s</code> の中に <code>sub</code> が含まれていれば <code>True</code>、そうでなければ <code>False</code> を返す関数 <code>contains_substring(s, sub)</code> を実装してください。",
          template: `def contains_substring(s, sub):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            {
              input: 'contains_substring("hello world", "world")',
              expected: true,
            },
            {
              input: 'contains_substring("hello world", "python")',
              expected: false,
            },
            { input: 'contains_substring("", "a")', expected: false },
            { input: 'contains_substring("abc", "")', expected: true },
          ],
        },
        {
          title: "19. 文字列の部分文字列置換",
          description:
            "文字列 <code>s</code>、置換対象の部分文字列 <code>old</code>、新しい部分文字列 <code>new</code> を受け取り、<code>s</code> の中のすべての <code>old</code> を <code>new</code> に置換した新しい文字列を返す関数 <code>replace_substring(s, old, new)</code> を実装してください。",
          template: `def replace_substring(s, old, new):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            {
              input: 'replace_substring("hello world", "world", "python")',
              expected: "hello python",
            },
            {
              input: 'replace_substring("banana", "na", "no")',
              expected: "bonono",
            },
            { input: 'replace_substring("", "a", "b")', expected: "" },
            { input: 'replace_substring("abc", "", "x")', expected: "xaxbxcx" },
          ],
        },
        {
          title: "20. 文字列の先頭・末尾の空白除去",
          description:
            "文字列 <code>s</code> を受け取り、先頭と末尾の空白文字を除去した新しい文字列を返す関数 <code>strip_whitespace(s)</code> を実装してください。",
          template: `def strip_whitespace(s):
    # ここにコードを書いてください
    pass
`,
          test_cases: [
            { input: 'strip_whitespace("  hello  ")', expected: "hello" },
            { input: 'strip_whitespace("  a b c  ")', expected: "a b c" },
            { input: 'strip_whitespace("")', expected: "" },
            { input: 'strip_whitespace("no spaces")', expected: "no spaces" },
          ],
        },
      ];

      let codingProblems = shuffleArray(defaultCodingProblems);
      let currentCodingIndex = 0;
      let codingScores = [];

      const codingQuestionContainer = document.getElementById(
        "coding-question-container",
      );
      const codeEditor = document.getElementById("code-editor");
      const lineNumbersContainer = document.getElementById("line-numbers-container");
      const editorBackdrop = document.getElementById("editor-backdrop");
      const runBtn = document.getElementById("run-btn");
      const formatBtn = document.getElementById("format-btn");
      const codingNextBtn = document.getElementById("coding-next-btn");
      const testResults = document.getElementById("test-results");
      const codingResultContainer = document.getElementById(
        "coding-result-container",
      );
      const codingProgress = document.getElementById("coding-progress");
      const codingTypeBadge = document.getElementById("coding-type-badge");
      const aiHintBtn = document.getElementById("ai-hint-btn");
      const aiHintPanel = document.getElementById("ai-hint-panel");
      const aiHintContent = document.getElementById("ai-hint-content");

      // 新規追加ボタン＆パネル
      const aiReviewBtn = document.getElementById("ai-review-btn");
      const aiReviewPanel = document.getElementById("ai-review-panel");
      const aiReviewContent = document.getElementById("ai-review-content");
      const stdoutContainer = document.getElementById("stdout-container");
      const stdoutTerminal = document.getElementById("stdout-terminal");

      function updateEditorDecorations() {
        if (!codeEditor || !lineNumbersContainer || !editorBackdrop) return;
        
        const text = codeEditor.value;
        const lines = text.split("\n");
        
        // 1. Update line numbers
        const lineCount = lines.length;
        let lineNumbersHtml = "";
        for (let i = 1; i <= lineCount; i++) {
          lineNumbersHtml += `<div class="editor-line">${i}</div>`;
        }
        lineNumbersContainer.innerHTML = lineNumbersHtml;
        
        // 2. Update backdrop with indent lines
        let backdropHtml = "";
        lines.forEach((line) => {
          // Replace tab characters with 4 spaces just in case
          const cleanLine = line.replace(/\t/g, "    ");
          
          // Count leading spaces
          const leadingSpacesMatch = cleanLine.match(/^( +)/);
          const leadingSpacesCount = leadingSpacesMatch ? leadingSpacesMatch[1].length : 0;
          const guideCount = Math.floor(leadingSpacesCount / 4);
          const extraSpacesCount = leadingSpacesCount % 4;
          
          let lineMarkup = "";
          // Indent guides
          for (let i = 0; i < guideCount; i++) {
            lineMarkup += `<span class="indent-guide">    </span>`;
          }
          // Extra spaces
          if (extraSpacesCount > 0) {
            lineMarkup += " ".repeat(extraSpacesCount);
          }
          
          // The rest of the text
          const remainingText = cleanLine.slice(leadingSpacesCount);
          lineMarkup += escapeHtml(remainingText);
          
          backdropHtml += `<div class="editor-line">${lineMarkup}</div>`;
        });
        editorBackdrop.innerHTML = backdropHtml;
        
        // Synchronize scroll
        editorBackdrop.scrollTop = codeEditor.scrollTop;
        editorBackdrop.scrollLeft = codeEditor.scrollLeft;
        lineNumbersContainer.scrollTop = codeEditor.scrollTop;
      }

      // Synchronize scroll on scroll event
      codeEditor.addEventListener("scroll", () => {
        editorBackdrop.scrollTop = codeEditor.scrollTop;
        editorBackdrop.scrollLeft = codeEditor.scrollLeft;
        lineNumbersContainer.scrollTop = codeEditor.scrollTop;
      });

      // Synchronize update on input event
      codeEditor.addEventListener("input", updateEditorDecorations);

      // ==========================================
      // エディタキーイベント＆オートインデント
      // ==========================================
      codeEditor.addEventListener("keydown", function (e) {
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const value = this.value;

        if (e.key === "Tab") {
          e.preventDefault();
          if (e.shiftKey) {
            const before = value.substring(0, start);
            const after = value.substring(end);
            const lineStart = before.lastIndexOf("\n") + 1;
            const line = value.substring(lineStart, start);

            if (line.startsWith("    ")) {
              this.value =
                before.substring(0, lineStart) + line.substring(4) + after;
              this.selectionStart = this.selectionEnd = start - 4;
            }
          } else {
            this.value =
              value.substring(0, start) + "    " + value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
          }
          updateEditorDecorations();
          return;
        }

        if (e.key === "Enter") {
          e.preventDefault();
          const beforeCursor = value.substring(0, start);
          const lastNewline = beforeCursor.lastIndexOf("\n");
          const currentLine = beforeCursor.substring(lastNewline + 1);

          const indentMatch = currentLine.match(/^( +)/);
          let indent = indentMatch ? indentMatch[1] : "";

          if (currentLine.trim().endsWith(":")) {
            indent += "    ";
          }

          this.value =
            value.substring(0, start) + "\n" + indent + value.substring(end);
          this.selectionStart = this.selectionEnd = start + 1 + indent.length;
          updateEditorDecorations();
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          formatCode();
          return;
        }

        const pairs = {
          "(": ")",
          "{": "}",
          "[": "]",
          '"': '"',
          "'": "'",
        };

        if (pairs[e.key] !== undefined) {
          e.preventDefault();
          const openChar = e.key;
          const closeChar = pairs[openChar];

          if (start !== end) {
            const selectedText = value.substring(start, end);
            this.value =
              value.substring(0, start) +
              openChar +
              selectedText +
              closeChar +
              value.substring(end);
            this.selectionStart = start + 1;
            this.selectionEnd = end + 1;
          } else {
            this.value =
              value.substring(0, start) +
              openChar +
              closeChar +
              value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
          }
          updateEditorDecorations();
          return;
        }

        const closeChars = [")", "}", "]", '"', "'"];
        if (closeChars.includes(e.key)) {
          if (start === end && value.charAt(start) === e.key) {
            e.preventDefault();
            this.selectionStart = this.selectionEnd = start + 1;
            updateEditorDecorations();
            return;
          }
        }

        if (e.key === "Backspace") {
          if (start === end && start > 0) {
            const charBefore = value.charAt(start - 1);
            const charAfter = value.charAt(start);
            if (pairs[charBefore] === charAfter) {
              e.preventDefault();
              this.value =
                value.substring(0, start - 1) + value.substring(start + 1);
              this.selectionStart = this.selectionEnd = start - 1;
              updateEditorDecorations();
            }
          }
        }
      });

      function formatCode() {
        const lines = codeEditor.value.split("\n");
        let indentLevel = 0;
        const formattedLines = lines.map((line) => {
          const trimmed = line.trim();
          if (trimmed === "") return "";

          if (
            trimmed.startsWith("return ") ||
            trimmed.startsWith("pass") ||
            trimmed.startsWith("elif ") ||
            trimmed.startsWith("else:") ||
            trimmed.startsWith("except ") ||
            trimmed.startsWith("finally:")
          ) {
            indentLevel = Math.max(0, indentLevel - 1);
          }

          const indented = "    ".repeat(indentLevel) + trimmed;

          if (trimmed.endsWith(":") && !trimmed.startsWith("#")) {
            indentLevel++;
          }

          return indented;
        });

        codeEditor.value = formattedLines.join("\n");
        updateEditorDecorations();
      }

      formatBtn.onclick = () => {
        formatCode();
      };

      function showCodingProblem() {
        const problem = codingProblems[currentCodingIndex];
        codingProgress.textContent = `${currentCodingIndex + 1} / ${codingProblems.length}`;
        codingQuestionContainer.innerHTML = `
        <h3 class="text-xl font-bold text-slate-900">${sanitizeHtml(problem.title)}</h3>
        <p class="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-150 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">${sanitizeHtml(problem.description)}</p>
      `;

        if (problem.isAiGenerated) {
          codingTypeBadge.classList.remove("hidden");
        } else {
          codingTypeBadge.classList.add("hidden");
        }

        codeEditor.value = problem.template;
        updateEditorDecorations();
        testResults.innerHTML = "";
        codingNextBtn.classList.add("hidden");
        aiHintPanel.classList.add("hidden");
        aiReviewPanel.classList.add("hidden");
        stdoutContainer.classList.add("hidden");
        stdoutTerminal.textContent = "";
      }

      // ==========================================
      // Brython 実行エンジン ＆ テスト採点
      // ==========================================
      function checkPotentialInfiniteLoop(code) {
        const trimmed = code.replace(/\s+/g, "");
        if (
          trimmed.includes("whileTrue:") ||
          trimmed.includes("while1:") ||
          trimmed.includes("whileTrue(") ||
          trimmed.includes("while1(")
        ) {
          return true;
        }
        if (code.includes("while ") || code.includes("while(")) {
          if (!code.includes("break")) {
            return true;
          }
        }
        return false;
      }

      function runCodingTests() {
        const problem = codingProblems[currentCodingIndex];
        const userCode = codeEditor.value;

        const forbiddenPatterns = [
          "__import__",
          "eval(",
          "exec(",
          "open(",
          "import os",
          "import sys",
          "import subprocess",
          "import socket",
          "import shutil",
          "__subclasses__",
          "__builtins__",
          "__code__",
          "__globals__",
          "getattr",
          "setattr",
          "delattr",
          "compile(",
          "globals(",
          "locals(",
          "__class__",
          "__bases__",
          "__mro__",
        ];

        for (const pattern of forbiddenPatterns) {
          if (userCode.includes(pattern)) {
            testResults.innerHTML = `
            <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
              ⚠️ セキュリティ制限：安全性に関わる可能性のある表現が検出されたため、検証を中止しました。コードを修正してください。
            </div>`;
            return;
          }
        }

        if (checkPotentialInfiniteLoop(userCode)) {
          askConfirm(() => {
            executePythonTests(userCode, problem);
          });
        } else {
          executePythonTests(userCode, problem);
        }
      }

      function executePythonTests(userCode, problem) {
        runBtn.disabled = true;
        runBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        検証中...
      `;
        testResults.innerHTML = `
        <div class="p-4 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-sm flex items-center gap-2 font-medium">
          コードの安全性を検証しています...
        </div>`;

        const testCasesSerialized = JSON.stringify(
          problem.test_cases.map((tc) => ({
            input: tc.input,
            expected: tc.expected,
          })),
        );
        try {
          let res = null;
          if (typeof window.run_python_tests !== 'function') {
            throw new Error("Python環境がまだ初期化されていません。少し待つか、ページを再読み込みしてください。");
          }
          const resultStr = window.run_python_tests(userCode, testCasesSerialized);
          if (resultStr) {
            res = JSON.parse(resultStr);
          }
          runBtn.disabled = false;
          runBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          実行して採点
        `;

          // 標準出力があれば表示
          if (res && res.stdout && res.stdout.trim().length > 0) {
            stdoutTerminal.textContent = res.stdout;
            stdoutContainer.classList.remove("hidden");
          } else {
            stdoutContainer.classList.add("hidden");
          }

          if (res && res.error) {
            testResults.innerHTML = `
            <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm">
              <strong class="block font-semibold mb-1">💡 構文エラー / 実行時エラーが発生しました:</strong>
              <code class="block whitespace-pre-wrap bg-rose-100 p-3 rounded text-xs mt-1 font-mono">${escapeHtml(res.error)}</code>
            </div>`;
            testResults.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
            return;
          }

          if (res && Array.isArray(res.tests)) {
            const total = res.tests.length;
            const passed = res.tests.filter((r) => r.pass).length;
            const score = passed / total;

            testResults.innerHTML = `
            <div class="p-4 bg-slate-100 border border-slate-200 rounded-lg flex justify-between items-center mb-4">
              <span class="font-bold text-slate-800 text-sm sm:text-base">テスト通過結果: ${passed} / ${total} 通過</span>
              <span class="text-xs font-bold px-3 py-1.5 rounded-full ${passed === total ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}">
                スコア: ${(score * 100).toFixed(0)}%
              </span>
            </div>
          `;

            res.tests.forEach((r) => {
              const passStyle = r.pass
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800";
              const passTag = r.pass
                ? '<span class="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">PASS</span>'
                : '<span class="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">FAIL</span>';

              testResults.innerHTML += `
              <div class="p-4 border rounded-lg ${passStyle} space-y-1.5 transition-all duration-150">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-xs uppercase tracking-wider text-slate-500">テストケース ${r.index + 1}</span>
                  ${passTag}
                </div>
                <div class="text-sm font-mono space-y-1">
                  <p><span class="opacity-75">入力式:</span> <code class="bg-black/5 px-1.5 py-0.5 rounded">${escapeHtml(r.input)}</code></p>
                  <p><span class="opacity-75">期待値 (Expected):</span> <code class="bg-black/5 px-1.5 py-0.5 rounded">${escapeHtml(r.expected)}</code></p>
                  <p><span class="opacity-75">実際の戻り値 (Actual):</span> <code class="bg-black/5 px-1.5 py-0.5 rounded">${r.error ? "エラー終了" : escapeHtml(r.actual)}</code></p>
                  ${r.error ? `<p class="text-xs text-rose-600 font-semibold bg-rose-100/50 p-2 rounded mt-1">エラー内容: ${escapeHtml(r.error)}</p>` : ""}
                </div>
              </div>
            `;
            });

            codingScores[currentCodingIndex] = score;

            // クリア状況をlocalStorage進捗に記録
            if (score === 1) {
              const pTitle = problem.title;
              if (!learningProgress.completedProblems.includes(pTitle)) {
                learningProgress.completedProblems.push(pTitle);
                if (problem.isAiGenerated) {
                  learningProgress.aiChallengesCleared += 1;
                }
                saveProgress();
              }
            }

            codingNextBtn.classList.remove("hidden");
            testResults.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          } else {
            testResults.innerHTML = `
            <div class="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
              テスト結果の抽出ができませんでした。記述内容を今一度見直してください。
            </div>`;
            testResults.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        } catch (err) {
          runBtn.disabled = false;
          runBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          実行して採点
        `;
          testResults.innerHTML = `
          <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm">
            <strong class="block font-semibold mb-1">評価システム実行エラー:</strong>
            <span class="block text-xs font-mono bg-rose-100 p-2 rounded mt-1">${escapeHtml(err.message || err)}</span>
          </div>`;
          testResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }

      function nextCodingProblem() {
        currentCodingIndex++;
        if (currentCodingIndex < codingProblems.length) {
          showCodingProblem();
        } else {
          showCodingResult();
        }
      }

      function showCodingResult() {
        document
          .getElementById("coding-quiz-container")
          .classList.add("hidden");
        codingResultContainer.classList.remove("hidden");

        const totalScore = codingScores.reduce((a, b) => a + (b || 0), 0);
        const maxScore = codingProblems.length;
        const avgScore = (totalScore / maxScore) * 100;

        codingResultContainer.innerHTML = `
        <div class="text-center space-y-3 pb-6 border-b border-slate-200">
          <h3 class="text-2xl font-bold text-slate-900">コーディングテスト 総合結果</h3>
          <p class="text-sm text-slate-500 font-medium">お疲れ様でした！全プログラミングミッションが終了しました。</p>
          <div class="flex justify-center gap-8 mt-4">
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600">${totalScore.toFixed(1)} / ${maxScore}</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">合計スコア</span>
            </div>
            <div class="text-center">
              <span class="block text-3xl font-extrabold text-indigo-600">${avgScore.toFixed(0)}%</span>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">総合達成率</span>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-slate-900">各設問の個別達成状況</h4>
          <ul class="space-y-2 max-h-96 overflow-y-auto pr-2">
            ${codingScores
              .map(
                (score, i) => `
              <li class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span class="font-medium text-slate-700 text-sm sm:text-base">${escapeHtml(codingProblems[i].title)}</span>
                <span class="text-sm font-bold px-3 py-1 rounded-full ${score === 1 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}">
                  達成率: ${(score * 100).toFixed(0)}%
                </span>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
        <div class="pt-6 flex justify-center">
          <button onclick="location.reload()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-colors">
            もう一度挑戦する
          </button>
        </div>
      `;
      }

      runBtn.onclick = runCodingTests;
      codingNextBtn.onclick = nextCodingProblem;

      // ==========================================
      // Gemini 3.5 Flash API 連携ロジック
      // ==========================================
      const defaultDefaultKey = "";

      function getGeminiUrl() {
        const savedKey = localStorage.getItem("gemini_api_key");
        const activeKey = savedKey ? savedKey.trim() : defaultDefaultKey;
        return {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${activeKey}`,
          hasKey: !!activeKey,
        };
      }

      async function callGemini(
        systemPrompt,
        userPrompt,
        isJson = false,
        responseSchema = null,
      ) {
        const apiConfig = getGeminiUrl();

        if (!apiConfig.hasKey) {
          apiKeyPanel.classList.remove("hidden");
          throw new Error(
            "Gemini APIキーが設定されていません。ヘッダーの「APIキー設定」から、ご自身のAPIキーを入力してください。",
          );
        }

        const payload = {
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        };

        if (isJson) {
          payload.generationConfig = {
            responseMimeType: "application/json",
          };
          if (responseSchema) {
            payload.generationConfig.responseSchema = responseSchema;
          }
        }

        let delay = 1000;
        for (let attempt = 0; attempt < 5; attempt++) {
          try {
            const response = await fetch(apiConfig.url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              if (response.status === 400 || response.status === 403) {
                throw new Error(
                  "APIキーが無効であるか、アクセス権限がありません。入力したキーが正しいか確認してください。",
                );
              }
              if (response.status === 404) {
                throw new Error(
                  "指定されたGemini 3.5 Flashモデルが見つかりません。APIアクセス権が有効かご確認ください。",
                );
              }
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`,
              );
            }

            const result = await response.json();
            const textResponse =
              result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textResponse) {
              throw new Error("応答内容が空です。");
            }
            return textResponse;
          } catch (error) {
            if (
              error.message.includes("APIキー") ||
              error.message.includes("404") ||
              attempt === 4
            ) {
              throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
          }
        }
      }

      const aiLoadingScreen = document.getElementById("ai-loading-screen");
      const aiLoadingTitle = document.getElementById("ai-loading-title");
      const aiLoadingDesc = document.getElementById("ai-loading-desc");

      function showAiLoader(title, description) {
        aiLoadingTitle.textContent = title;
        aiLoadingDesc.textContent = description;
        aiLoadingScreen.classList.remove("hidden");
      }

      function hideAiLoader() {
        aiLoadingScreen.classList.add("hidden");
      }

      // ==========================================
      // トピック＆難易度別生成バンク
      // ==========================================
      const categorizedQuizTopics = {
        beginner: [
          "変数宣言と不変オブジェクト",
          "if文を用いた条件判定",
          "forループと基本範囲関数(range)",
          "関数の基本戻り値(Noneなど)",
          "リスト(list)の追加・スライス操作",
          "論理演算子(and/or/not)",
          "標準出力(print)とフォーマット文字列(f-string)",
        ],
        intermediate: [
          "リスト内包表記(List Comprehensions)",
          "基本例外処理(try-except-finally)",
          "辞書(dict)と集合(set)の積集合・差集合操作",
          "可変長引数(*args, **kwargs)とアンパック",
          "lambda(無名関数)と組み込み高階関数(map, filter)",
          "コンテキストマネージャとwith文による安全なファイル入出力",
          "標準モジュール(datetime, math)の活用",
          "ジェネレータオブジェクトとyield文によるメモリ節約",
        ],
        advanced: [
          "クラスの多重継承とメソッド解決順序(MRO)",
          "デコレータ(@decorator)の実装とネスト",
          "特殊メソッド(__str__, __repr__, __call__, __eq__)の実装",
          "カスタムコンテキストマネージャ(__enter__, __exit__)の設計",
          "抽象クラス(abc.ABC)と多態性(Polymorphism)",
          "メタクラス(__metaclass__)の利用と動的クラス生成",
          "非异步処理(asyncioモジュールとasync/await)",
          "特殊デコレータ(@property, @classmethod, @staticmethod)の正確な使い分け",
        ],
      };

      const categorizedCodingTopics = {
        beginner: [
          "引数を反転して返す文字列処理",
          "リスト内の偶数値のみのフィルタリングと和の算出",
          "基本FizzBuzzゲーム関数の実装",
          "リスト内の重複データを順序を維持して除外",
          "文字列スライスを使った回文判定判定器",
        ],
        intermediate: [
          "文章内の単語出現頻度をカウントして辞書で返す関数",
          "入力値の検証を行う独自例外(ValueError拡張)のレイズ",
          "lambdaと複数キーを用いた複雑な多次元リスト・辞書の整列(sort)",
          "再帰関数を用いたフィボナッチ数列、または効率的な最大公約数(GCD)計算",
        ],
        advanced: [
          "独自のリンクリストや二分木データ構造を操作するクラス設計",
          "コンテキストマネージャによる即時トランザクションロールバック擬似システム",
          "カプセル化された非公開変数のバリデーションデコレータ(@property)設計",
          "API呼び出し等の高負荷処理を最適化するキャッシュ処理(Memoization)用自作デコレータ",
        ],
      };

      const difficultyLabels = {
        beginner: "初級 (Beginner)",
        intermediate: "中級 (Intermediate)",
        advanced: "上級 (Advanced)",
      };

      // ==========================================
      // AI問題生成処理 (Gemini 3.5 Flash)
      // ==========================================
      const aiQuizTopicInput = document.getElementById("ai-quiz-topic");
      const aiQuizDifficultySelect =
        document.getElementById("ai-quiz-difficulty");
      const aiQuizGenerateBtn = document.getElementById("ai-quiz-generate-btn");

      aiQuizGenerateBtn.onclick = async () => {
        if (aiQuizGenerateBtn.disabled) return;
        aiQuizGenerateBtn.disabled = true;
        let topic = aiQuizTopicInput.value.trim();
        let difficulty = aiQuizDifficultySelect.value;

        if (difficulty === "random") {
          const levels = ["beginner", "intermediate", "advanced"];
          difficulty = levels[Math.floor(Math.random() * levels.length)];
        }

        if (!topic) {
          const pool = categorizedQuizTopics[difficulty];
          topic = pool[Math.floor(Math.random() * pool.length)];
        }

        const label = difficultyLabels[difficulty];
        showAiLoader(
          "✨ AIクイズを作成中...",
          `Gemini 3.5 Flashが「${label}」レベルのテーマ「${topic}」に関する深い知識を問うハイクオリティな問題を作成しています。`,
        );

        let difficultyPromptConstraint = "";
        if (difficulty === "beginner") {
          difficultyPromptConstraint =
            "Pythonの基本概念、初級文法、初学者がつまずきやすい落とし穴に焦点を当てた、難しすぎない問題にしてください。";
        } else if (difficulty === "intermediate") {
          difficultyPromptConstraint =
            "標準ライブラリの適切な組み合わせ、リスト内包表記の挙動、エラーを適切にハンドルする作法など、ある程度実務で見かける応用的な問題にしてください。";
        } else {
          difficultyPromptConstraint =
            "Pythonの内部構造、言語仕様(MRO、特殊メソッド、非同期処理の仕組み、デコレータ、メモリ管理)など、熟練者でも一瞬迷うような非常に高い完成度・深さの問題にしてください。";
        }

        const systemPrompt = `あなたは優秀なPythonプログラミング講師です。
提示された難易度レベルに【100%厳格に合致する】、Python知識を問う高品質な4択クイズを日本語で1問作成してください。
安易に正解できる問題ではなく、コードの実行結果を注意深く推測する必要がある問題を作ってください。`;

        const userPrompt = `難易度: ${label}
対象トピック: ${topic}
難易度設計基準: ${difficultyPromptConstraint}

この情報を元に、4択クイズ（問題文、選択肢4つ、その中の1つが完全一致する正解文字列）を1問作成し、指定のJSON形式で返してください。`;

        const quizSchema = {
          type: "OBJECT",
          properties: {
            question: {
              type: "STRING",
              description:
                "クイズの問題文。ソースコードを含む場合はマークダウンのコードブロック(```)等で整形してください。",
            },
            options: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "4つの明確に異なる選択肢テキストのリスト",
            },
            correctAnswer: {
              type: "STRING",
              description:
                "optionsリストの要素のいずれかと一字一句完全に一致する正解のテキスト",
            },
          },
          required: ["question", "options", "correctAnswer"],
        };

        try {
          const jsonText = await callGemini(
            systemPrompt,
            userPrompt,
            true,
            quizSchema,
          );
          const parsedQuiz = JSON.parse(jsonText);

          const shuffledOptions = shuffleArray(parsedQuiz.options);
          const correctIndex = shuffledOptions.indexOf(
            parsedQuiz.correctAnswer,
          );

          let finalCorrectIndex = correctIndex;
          if (correctIndex === -1) {
            shuffledOptions.push(parsedQuiz.correctAnswer);
            finalCorrectIndex = shuffledOptions.length - 1;
          }

          const newQuestion = {
            question: `[AI生成 - ${label}] ${parsedQuiz.question ? parsedQuiz.question.replace(/\\n/g, "\n") : ""}`,
            options: shuffledOptions,
            correctIndex: finalCorrectIndex,
            correctAnswer: parsedQuiz.correctAnswer,
            isAiGenerated: true,
          };

          quizQuestions = [newQuestion, ...quizQuestions];
          currentQuizIndex = 0;
          quizScore = 0;
          quizUserAnswers = [];

          quizResultContainer.classList.add("hidden");
          document.getElementById("quiz-container").classList.remove("hidden");
          showQuizQuestion();

          aiQuizTopicInput.value = "";
        } catch (err) {
          notify(`${err.message}`, "AIクイズ生成失敗", "error");
        } finally {
          hideAiLoader();
          aiQuizGenerateBtn.disabled = false;
        }
      };

      // ==========================================
      // AIコーディング問題生成処理 (Gemini 3.5 Flash)
      // ==========================================
      const aiCodingTopicInput = document.getElementById("ai-coding-topic");
      const aiCodingDifficultySelect = document.getElementById(
        "ai-coding-difficulty",
      );
      const aiCodingGenerateBtn = document.getElementById(
        "ai-coding-generate-btn",
      );

      aiCodingGenerateBtn.onclick = async () => {
        if (aiCodingGenerateBtn.disabled) return;
        aiCodingGenerateBtn.disabled = true;
        let topic = aiCodingTopicInput.value.trim();
        let difficulty = aiCodingDifficultySelect.value;

        if (difficulty === "random") {
          const levels = ["beginner", "intermediate", "advanced"];
          difficulty = levels[Math.floor(Math.random() * levels.length)];
        }

        if (!topic) {
          const pool = categorizedCodingTopics[difficulty];
          topic = pool[Math.floor(Math.random() * pool.length)];
        }

        const label = difficultyLabels[difficulty];
        showAiLoader(
          "✨ AI課題をビルド中...",
          `Gemini 3.5 Flashが「${label}」難易度に適したテーマ「${topic}」に基づく、自動評価テスト付きコーディング問題を設計しています。`,
        );

        let difficultyPromptConstraint = "";
        if (difficulty === "beginner") {
          difficultyPromptConstraint =
            "初心者向け。関数設計、単純なループ処理、ifによる条件判定を主体とし、引数や戻り値の型も単純なもの（int, str, boolなど）に抑えてください。";
        } else if (difficulty === "intermediate") {
          difficultyPromptConstraint =
            "中級者向け。辞書や集合、スライス、基本的なビルトイン関数、内包表記を組み合わせる必要があるような、実用的なアルゴリズム問題にしてください。";
        } else {
          difficultyPromptConstraint =
            "上級者向け。カスタムクラスの設計、クラス間継承、特殊メソッドによる演算子オーバーロード、キャッシュ等を用いた効率的な計算設計、ジェネレータなど、本格的なスキルを必要とし、アサーションも境界値や例外発生をアサートする非自明なものにしてください。";
        }

        const systemPrompt = `あなたは非常に優秀なPython試験問題設計士です。
ユーザーが指定するテーマと難易度レベルに完全に適したコーディングテスト問題を1問作成してください。
この問題は、ブラウザ内のPythonランナーで動的テスト（eval関数）されます。
関数名、その引数、および期待される戻り値を明確にしたコーディング問題と、自動評価用の複数のテストケース（関数呼び出し式と、期待される戻り値）をJSONで生成してください。`;

        const userPrompt = `難易度: ${label}
テーマ: ${topic}
難易度設計規約: ${difficultyPromptConstraint}

Brython自動採点システム対応の問題、解答テンプレート、およびテストケース of 配列（4ケース以上、特にエッジケースや例外ケースの検証も含めること）を、指定 of JSONスキーマに沿って生成してください。`;

        const codingSchema = {
          type: "OBJECT",
          properties: {
            title: {
              type: "STRING",
              description:
                "課題のタイトル（例: プロパティデコレータによる年齢検証）",
            },
            description: {
              type: "STRING",
              description:
                "課題の詳しい日本語説明。実装すべき関数名（またはクラス名）と、その役割、引数・戻り値の型などを極めて分かりやすく明記すること。",
            },
            template: {
              type: "STRING",
              description:
                "ユーザーが最初にエディタに入力するコード構造、または関数/クラス定義（例: 'def filter_list(lst):\n    # ここにコードを書く\n    pass'）",
            },
            test_cases: {
              type: "ARRAY",
              description:
                "テスト用のケースのリスト。各ケースは文字列としての入力呼び出しと、評価される戻り値オブジェクトを持つ。",
              items: {
                type: "OBJECT",
                properties: {
                  input: {
                    type: "STRING",
                    description:
                      "評価する呼び出し関数式。例: 'filter_list([1, 2, -3])' や 'MyClass(10).calc()'",
                  },
                  expected: {
                    type: "STRING",
                    description: "...例: '(1, 2)', '[2, 4]', '{\"a\": 1}', 'None', 'True', '24'",
                  },
                },
                required: ["input", "expected"],
              },
            },
          },
          required: ["title", "description", "template", "test_cases"],
        };

        try {
          const jsonText = await callGemini(
            systemPrompt,
            userPrompt,
            true,
            codingSchema,
          );
          const parsedProblem = JSON.parse(jsonText);

          const newProblem = {
            title: `[AI生成 - ${label}] ${parsedProblem.title}`,
            description: parsedProblem.description
              ? parsedProblem.description.replace(/\\n/g, "\n")
              : "",
            template: parsedProblem.template,
            test_cases: parsedProblem.test_cases,
            isAiGenerated: true,
          };

          codingProblems = [newProblem, ...codingProblems];
          currentCodingIndex = 0;
          codingScores = [];

          codingResultContainer.classList.add("hidden");
          document
            .getElementById("coding-quiz-container")
            .classList.remove("hidden");
          showCodingProblem();

          aiCodingTopicInput.value = "";
        } catch (err) {
          notify(`${err.message}`, "AI課題生成失敗", "error");
        } finally {
          hideAiLoader();
          aiCodingGenerateBtn.disabled = false;
        }
      };

      // ==========================================
      // AIヒント機能
      // ==========================================
      aiHintBtn.onclick = async () => {
        const problem = codingProblems[currentCodingIndex];
        const userCode = codeEditor.value;

        showAiLoader(
          "✨ コードを読み解き中...",
          "AI先生があなたの解答コードと問題文を分析し、アドバイスを用意しています。",
        );

        const systemPrompt = `あなたはプログラミングを始めたばかりの超初心者（forやifの使い方もまだよくわかっていない生徒）に、優しく伴走するPythonの家庭教師AIです。

以下の【絶対ルール】を厳守して指導してください。
1. 直接の解答コード（生徒がコピー＆ペーストしてそのまま動く答え）は絶対に教えてはいけません。
2. 生徒がこの課題を解くために「何を使えばよいか（for, if などの構文や、len() などの基本的な関数）」を優しく教えてください。
3. その構文や関数の「一般的な書き方（構文のテンプレート例）」を、今回の問題に依存しない一般的なプレースホルダーを使った形で親切に教えてあげてください。
4. バグがあれば、何行目で何が起きているかを小学生でもわかるように優しく日本語で解説し、考え方のステップをナビゲートしてください。`;

        const userPrompt = `【問題タイトル】: ${problem.title}
【問題文】: ${problem.description}
【期待するテストケース例】: ${JSON.stringify(problem.test_cases)}

【生徒が現在記述した解答コード】:
\`\`\`python
${userCode}
\`\`\`

この情報を元に、超初心者に向けた丁寧なアドバイスをMarkdown形式の日本語で作成してください。`;

        try {
          const hintText = await callGemini(systemPrompt, userPrompt, false);

          aiHintContent.innerHTML = sanitizeHtml(marked.parse(hintText));
          aiHintPanel.classList.remove("hidden");
          aiReviewPanel.classList.add("hidden"); // コードレビュー側は閉じる
          aiHintPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } catch (err) {
          notify(`${err.message}`, "AIヒント取得失敗", "error");
        } finally {
          hideAiLoader();
        }
      };

      // ==========================================
      // AIレビュー＆模範解答機能 (新規追加)
      // ==========================================
      aiReviewBtn.onclick = async () => {
        const problem = codingProblems[currentCodingIndex];
        const userCode = codeEditor.value;

        showAiLoader(
          "🎓 コードレビュー ＆ 解答例を生成中...",
          "AI先生が最適なPythonicコードと、あなたの解答に対する詳細なコードレビューを構成しています。",
        );

        const systemPrompt = `あなたはシニアPythonエンジニアであり、素晴らしい技術指導者です。
生徒が書いたコードをレビューし、リファクタリング、パフォーマンス、Pythonicさ（PEP 8適合など）の観点から徹底評価してください。
また、もっとも模範的かつクリーンな「模範解答コード例」と、その時間計算量および空間計算量の解説を提供してください。
解答コードブロックは必ずマークダウン（\`\`\`python）で記述してください。`;

        const userPrompt = `【課題タイトル】: ${problem.title}
【課題説明】: ${problem.description}
【期待されるアサーションテスト】: ${JSON.stringify(problem.test_cases)}

【生徒が現在書いた解答コード】:
\`\`\`python
${userCode}
\`\`\`

この情報を元に、以下の3つの構成でMarkdown形式の丁寧なレビューを行ってください。
1. **生徒のコードの評価・アドバイス**: 良かった点、リファクタリングできる点、バグがあればその指摘。
2. **もっとも洗練された模範解答コード例**: PEP 8に沿った美しいコード例。
3. **計算量と設計のアプローチ解説**: なぜこの模範コードが優れているのか、計算量（O記法）も交えた技術解説。`;

        try {
          const reviewText = await callGemini(systemPrompt, userPrompt, false);

          aiReviewContent.innerHTML = sanitizeHtml(marked.parse(reviewText));
          aiReviewPanel.classList.remove("hidden");
          aiHintPanel.classList.add("hidden"); // ヒント側は閉じる
          aiReviewPanel.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        } catch (err) {
          notify(`${err.message}`, "AIレビュー取得失敗", "error");
        } finally {
          hideAiLoader();
        }
      };

      // ==========================================
      // モード切り替えロジック
      // ==========================================
      const modeQuizBtn = document.getElementById("mode-quiz");
      const modeCodingBtn = document.getElementById("mode-coding");
      const quizMode = document.getElementById("quiz-mode");
      const codingMode = document.getElementById("coding-mode");

      function setActiveMode(mode) {
        const activeClass = ["bg-white", "text-indigo-700", "shadow-sm"];
        const inactiveClass = ["text-indigo-100", "hover:text-white"];

        if (mode === "quiz") {
          modeQuizBtn.classList.add(...activeClass);
          modeQuizBtn.classList.remove(...inactiveClass);
          modeCodingBtn.classList.remove(...activeClass);
          modeCodingBtn.classList.add(...inactiveClass);
          quizMode.classList.remove("hidden");
          codingMode.classList.add("hidden");
        } else {
          modeCodingBtn.classList.add(...activeClass);
          modeCodingBtn.classList.remove(...inactiveClass);
          modeQuizBtn.classList.remove(...activeClass);
          modeQuizBtn.classList.add(...inactiveClass);
          codingMode.classList.remove("hidden");
          quizMode.classList.add("hidden");
        }
      }

      modeQuizBtn.onclick = () => {
        setActiveMode("quiz");
        currentQuizIndex = 0;
        quizScore = 0;
        quizUserAnswers = [];
        showQuizQuestion();
        quizResultContainer.classList.add("hidden");
        document.getElementById("quiz-container").classList.remove("hidden");
      };

      modeCodingBtn.onclick = () => {
        setActiveMode("coding");
        currentCodingIndex = 0;
        codingScores = [];
        codingProblems = shuffleArray(defaultCodingProblems);
        showCodingProblem();
        codingResultContainer.classList.add("hidden");
        document
          .getElementById("coding-quiz-container")
          .classList.remove("hidden");
      };

      // 初回起動
      setActiveMode("quiz");
      showQuizQuestion();
