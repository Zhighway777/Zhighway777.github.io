import { motion } from "framer-motion";
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
      <div className="question-meta">
        <span>{question.scenario}</span>
      </div>
      <h2>{question.text}</h2>
      <div className="option-list" role="radiogroup" aria-label={question.text}>
        {question.options.map((option, index) => (
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
              <motion.span
                className="selected-dot"
                layoutId="selected-option"
                transition={{ duration: 0.18 }}
              />
            )}
            <span className="visually-hidden">选项 {index + 1}</span>
          </button>
        ))}
      </div>
    </motion.article>
  );
}
