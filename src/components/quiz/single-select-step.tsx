"use client";

import { motion } from "motion/react";

interface SingleSelectStepProps {
  question: string;
  subtitle?: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

export function SingleSelectStep({
  question,
  subtitle,
  options,
  onSelect,
}: SingleSelectStepProps) {
  // Use grid for 4 options, stack for 5+
  const useGrid = options.length <= 4;

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]"
        >
          {question}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground text-base"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <div className={useGrid ? "grid grid-cols-2 gap-3" : "space-y-3"}>
        {options.map((option, i) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
            onClick={() => onSelect(option.value)}
            className={`${useGrid ? "h-20" : "h-14"} px-5 rounded-2xl border border-foreground/80 bg-white text-foreground text-base font-medium
                       cursor-pointer text-center
                       hover:bg-primary hover:text-primary-foreground hover:border-primary
                       active:scale-[0.97] transition-all duration-150`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
