"use client";

import { useState, FormEvent } from "react";
import { motion } from "motion/react";

interface TextareaStepProps {
  question: string;
  subtitle?: string;
  placeholder?: string;
  required: boolean;
  initialValue?: string;
  onSubmit: (value: string) => void;
}

export function TextareaStep({
  question,
  subtitle,
  placeholder,
  required,
  initialValue = "",
  onSubmit,
}: TextareaStepProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (required && trimmed.length === 0) {
      setError("This one's required.");
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError("");
        }}
        placeholder={placeholder}
        rows={5}
        autoFocus
        className="w-full px-6 py-4 rounded-2xl border border-foreground/30 bg-background text-foreground text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground resize-none"
      />
      {error && <p className="text-sm text-destructive pl-4">{error}</p>}

      <button
        type="submit"
        className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
      >
        {required ? "Next" : value.trim() ? "Next" : "Skip"}
      </button>
    </form>
  );
}
