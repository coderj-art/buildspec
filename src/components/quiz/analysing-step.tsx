"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AnalysingStepProps {
  onComplete: (insight: string) => void;
  formData: Record<string, unknown>;
  segment: string;
}

const messages = [
  "Reading your answers...",
  "Analysing your business profile...",
  "Building your personalised report...",
];

export function AnalysingStep({ onComplete, formData, segment }: AnalysingStepProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages
    const interval = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, messages.length - 1));
    }, 1500);

    // Call LLM API
    const generateInsight = async () => {
      try {
        const res = await fetch("/api/generate-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData, segment }),
        });
        const data = await res.json();

        if (data.success && data.insight) {
          // Wait minimum 4 seconds total so it doesn't feel instant
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(4000 - elapsed, 0);
          setTimeout(() => onComplete(data.insight), remaining);
        } else {
          // Fallback if LLM fails
          setTimeout(() => onComplete(""), 4000);
        }
      } catch {
        setTimeout(() => onComplete(""), 4000);
      }
    };

    const startTime = Date.now();
    generateInsight();

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-8">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="size-12 border-[3px] border-border border-t-foreground rounded-full animate-spin" />
        </div>

        {/* Cycling message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-medium"
          >
            {messages[messageIndex]}
          </motion.p>
        </AnimatePresence>

        <p className="text-sm text-muted-foreground">This takes a few seconds</p>
      </div>
    </div>
  );
}
