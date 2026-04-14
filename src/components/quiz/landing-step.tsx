"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

interface LandingStepProps {
  onStart: () => void;
}

export function LandingStep({ onStart }: LandingStepProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full px-6 pt-5"
      >
        <div className="max-w-xs mx-auto bg-foreground rounded-full px-6 py-3 flex items-center justify-center gap-3">
          <span className="text-background text-sm font-semibold tracking-tight">
            BUILDSPEC
          </span>
          <span className="text-background/60 text-xs">
            by James Wild
          </span>
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="w-full max-w-5xl text-center space-y-8 relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm uppercase tracking-[0.2em] text-muted-foreground"
          >
            Free · Under 10 minutes
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[2.25rem] sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.95]"
          >
            Stop guessing what to build first.
            <br />
            Get the exact spec.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground leading-snug max-w-2xl mx-auto"
          >
            Answer 10 questions. Get a personalised one-page spec for the
            exact tool you should build first with Claude Code.
            Internal ops, client tools, or a product to sell. Whatever fits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 h-16 px-14 rounded-full bg-primary text-primary-foreground font-bold text-lg cursor-pointer uppercase tracking-wider hover:opacity-80 active:scale-[0.98] transition-all duration-200"
            >
              Build My Spec
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card. Plus a 22-day build plan to your inbox.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex items-center justify-center pt-6"
          >
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <CountUp target={52} suffix="K+" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">followers</p>
            </div>
            <div className="w-px h-12 bg-foreground/20" />
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <CountUp target={6} />
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                apps shipped
              </p>
            </div>
            <div className="w-px h-12 bg-foreground/20" />
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <CountUp target={1600} suffix="+" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                founders trained
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
