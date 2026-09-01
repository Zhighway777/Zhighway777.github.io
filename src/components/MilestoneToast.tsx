import { AnimatePresence, motion } from "framer-motion";
import { Flag, Sparkles } from "lucide-react";

export interface Milestone {
  id: "half" | "quarter-left";
  title: string;
  description: string;
}

interface MilestoneToastProps {
  milestone: Milestone | null;
}

export default function MilestoneToast({ milestone }: MilestoneToastProps) {
  return (
    <AnimatePresence>
      {milestone && (
        <motion.aside
          key={milestone.id}
          className="milestone-toast"
          initial={{ opacity: 0, y: -28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          aria-live="polite"
        >
          <motion.span
            className="milestone-icon"
            initial={{ rotate: -18, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
          >
            {milestone.id === "half" ? <Sparkles aria-hidden="true" /> : <Flag aria-hidden="true" />}
          </motion.span>
          <div>
            <strong>{milestone.title}</strong>
            <p>{milestone.description}</p>
          </div>
          <motion.span
            className="milestone-ring"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.9, repeat: 1 }}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
