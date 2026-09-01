import { motion } from "framer-motion";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import MilestoneToast, { type Milestone } from "../components/MilestoneToast";
import QuestionCard from "../components/QuestionCard";
import { questions } from "../lib/questions";
import { buildResult } from "../lib/scoring";
import { sessionStore } from "../lib/session";

export default function Test() {
  const [, navigate] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [milestone, setMilestone] = useState<Milestone | null>(null);

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
  const answeredCount = useMemo(
    () => questions.filter((item) => answers[item.id]).length,
    [answers],
  );
  const progress = (answeredCount / questions.length) * 100;

  const finish = (finalAnswers: Record<string, string>) => {
    const result = buildResult(questions, finalAnswers, sessionStore.getNickname());
    sessionStore.setResult(result);
    sessionStore.clearProgress();
    navigate("/results");
  };

  const selectOption = (optionId: string) => {
    const nextAnswers = { ...answers, [question.id]: optionId };
    const nextAnsweredCount = questions.filter((item) => nextAnswers[item.id]).length;
    setAnswers(nextAnswers);
    setRestored(true);

    if (nextAnsweredCount === 13) {
      setMilestone({
        id: "half",
        title: "过半啦",
        description: "已经完成 13/25，节奏很好",
      });
    }

    if (nextAnsweredCount === 19) {
      setMilestone({
        id: "quarter-left",
        title: "最后四分之一",
        description: "只剩 6 题，马上揭晓人格卡",
      });
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finish(nextAnswers);
    }

  };

  const goPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const restart = () => {
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
          已答 {answeredCount} 题 · 剩余 {questions.length - answeredCount} 题 · 进度本机保存
        </p>
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        selectedOption={answers[question.id]}
        onSelect={selectOption}
      />

      <footer className="test-footer">
        <p className="test-footer-copy">
          点击选项会自动进入下一题；如需修改，请点上一题。
        </p>
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
      </footer>

      <MilestoneToast milestone={milestone} />
    </main>
  );
}
