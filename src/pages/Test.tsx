import { motion } from "framer-motion";
import { ChevronLeft, CircleSlash, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import MilestoneToast, { type Milestone } from "../components/MilestoneToast";
import QuestionCard from "../components/QuestionCard";
import { questions } from "../lib/questions";
import { buildResult, MINIMUM_EFFECTIVE_ANSWERS, SKIP_ANSWER } from "../lib/scoring";
import { sessionStore } from "../lib/session";

const AUTO_ADVANCE_DELAY_MS = 360;

export default function Test() {
  const [, navigate] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [notice, setNotice] = useState("");
  const advanceTimerRef = useRef<number | null>(null);

  const clearPendingAdvance = () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  useEffect(() => clearPendingAdvance, []);

  useEffect(() => {
    const savedAnswers = sessionStore.getAnswers();
    setAnswers(savedAnswers);
    const savedIndex = sessionStore.getCurrentIndex();
    setCurrentIndex(Math.min(savedIndex, questions.length - 1));
    setRestored(Object.keys(savedAnswers).length > 0);
  }, []);

  useEffect(() => {
    if (restored) {
      sessionStore.setAnswers(answers);
      sessionStore.setCurrentIndex(currentIndex);
    }
  }, [answers, currentIndex, restored]);

  useEffect(() => {
    if (!milestone) return;
    const timer = window.setTimeout(() => setMilestone(null), 1900);
    return () => window.clearTimeout(timer);
  }, [milestone]);

  const question = questions[currentIndex];
  const handledCount = useMemo(
    () => questions.filter((item) => answers[item.id]).length,
    [answers],
  );
  const effectiveAnsweredCount = useMemo(
    () => questions.filter((item) => answers[item.id] && answers[item.id] !== SKIP_ANSWER).length,
    [answers],
  );
  const skippedCount = useMemo(
    () => questions.filter((item) => answers[item.id] === SKIP_ANSWER).length,
    [answers],
  );
  const progress = (handledCount / questions.length) * 100;

  const finish = (finalAnswers: Record<string, string>) => {
    const nextEffectiveCount = questions.filter(
      (item) => finalAnswers[item.id] && finalAnswers[item.id] !== SKIP_ANSWER,
    ).length;
    if (nextEffectiveCount < MINIMUM_EFFECTIVE_ANSWERS) {
      setNotice(
        `有效作答不足：还需回答 ${MINIMUM_EFFECTIVE_ANSWERS - nextEffectiveCount} 道有经验的题目。`,
      );
      return;
    }

    const result = buildResult(questions, finalAnswers, sessionStore.getNickname());
    sessionStore.setResult(result);
    sessionStore.clearProgress();
    navigate("/results");
  };

  const recordAnswer = (answer: string) => {
    clearPendingAdvance();
    const nextAnswers = { ...answers, [question.id]: answer };
    const nextHandledCount = questions.filter((item) => nextAnswers[item.id]).length;
    setAnswers(nextAnswers);
    setRestored(true);
    setNotice("");

    if (nextHandledCount === 13) {
      setMilestone({
        id: "half",
        title: "过半啦",
        description: "已经完成 13/25，节奏很好",
      });
    }

    if (nextHandledCount === 19) {
      setMilestone({
        id: "quarter-left",
        title: "最后四分之一",
        description: "只剩 6 题，马上揭晓人格卡",
      });
    }

    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        finish(nextAnswers);
      }
    }, AUTO_ADVANCE_DELAY_MS);

  };

  const selectOption = (optionId: string) => recordAnswer(optionId);
  const skipQuestion = () => recordAnswer(SKIP_ANSWER);

  const goPrevious = () => {
    clearPendingAdvance();
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const restart = () => {
    clearPendingAdvance();
    sessionStore.clearProgress();
    setAnswers({});
    setCurrentIndex(0);
    setMilestone(null);
  };

  return (
    <main className="page-shell narrow">
      <header className="test-header">
        <button
          className="button ghost small icon-button"
          type="button"
          onClick={() => navigate("/")}
          aria-label="返回首页"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <div className="test-meta">
          <strong>
            第 {currentIndex + 1} / {questions.length} 题
          </strong>
          <span>{question.scenario}</span>
          <button
            className="button ghost small icon-button"
            type="button"
            onClick={restart}
            aria-label="重新开始测试"
          >
            <RotateCcw aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="test-progress">
        <div className="progress-copy">
          <span>答题进度</span>
          <strong>{Math.round(progress)}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="测试进度"
        >
          <motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.25 }} />
        </div>
        <p>
          已答 {effectiveAnsweredCount} 题 · 跳过 {skippedCount} 题 · 未处理 {questions.length - handledCount} 题 · 进度本机保存
        </p>
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        selectedOption={answers[question.id]}
        onSelect={selectOption}
      />

      {notice && <div className="test-notice" role="alert">{notice}</div>}

      <footer className="test-footer">
        <p className="test-footer-copy">
          选择后会自动进入下一题；没经历过的场景可跳过。
        </p>
        <div className="test-footer-actions">
          <button
            className="button ghost"
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            aria-label="上一题"
          >
            <ChevronLeft aria-hidden="true" />
            <span className="test-footer-label">上一题</span>
          </button>
          <button
            className={`button ghost skip-button ${
              answers[question.id] === SKIP_ANSWER ? "selected" : ""
            }`}
            type="button"
            onClick={skipQuestion}
            aria-pressed={answers[question.id] === SKIP_ANSWER}
          >
            <CircleSlash aria-hidden="true" />
            <span>Skip</span>
          </button>
        </div>
      </footer>

      <MilestoneToast milestone={milestone} />
    </main>
  );
}
