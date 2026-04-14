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
  return (
    <div className="space-y-8 max-w-2xl mx-auto w-full">
      <div className="space-y-3 text-center">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, i) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
            onClick={() => onSelect(option.value)}
            className="group relative min-h-[72px] px-5 py-4 rounded-2xl
                       bg-card border border-border text-foreground
                       text-base font-medium text-left cursor-pointer
                       hover:border-primary hover:bg-primary/10
                       hover:text-primary
                       active:scale-[0.98]
                       transition-all duration-150"
          >
            <span className="relative z-10">{option.label}</span>
            <span
              aria-hidden
              className="absolute right-4 top-1/2 -translate-y-1/2 size-6 rounded-full border border-border group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-all"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <path
                  d="M2 5.5L4.5 8L9 2.5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
