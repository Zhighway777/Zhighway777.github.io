import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Question } from "../lib/types";

interface QuestionCardProps {
  question: Question;
  selectedOption?: string;
  onSelect: (optionId: string) => void;
}

export default function QuestionCard({
  question,
  selectedOption,
  onSelect,
}: QuestionCardProps) {
  return (
    <motion.article
      key={question.id}
      className="question-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.24 }}
      aria-live="polite"
    >
      <div className="question-header">
        <span className="question-number">#{question.id.replace("Q", "")}</span>
        <span className="question-meta">{question.scenario}</span>
      </div>
      <h2>{question.text}</h2>
      <p className="answer-hint">没有标准答案，按你实际的工作方式选择。</p>
      <div className="option-list" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`option-button ${
              selectedOption === option.id ? "selected" : ""
            }`}
            onClick={() => onSelect(option.id)}
            aria-checked={selectedOption === option.id}
            role="radio"
          >
            <span className="option-letter">{option.id}</span>
            <span>{option.text}</span>
            {selectedOption === option.id && (
              <motion.span className="selected-check" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <Check aria-hidden="true" />
              </motion.span>
            )}
          </button>
        ))}
      </div>
    </motion.article>
  );
}
