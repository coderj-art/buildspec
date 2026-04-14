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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

interface LandingStepProps {
  onStart: () => void;
}

export function LandingStep({ onStart }: LandingStepProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating glass nav bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full px-6 pt-5"
      >
        <div className="max-w-xs mx-auto bg-foreground rounded-full px-6 py-3 flex items-center justify-center gap-3">
          <img src="/b7s-logo-white.png" alt="Beyond Seven Studios" className="h-5" />
          <span className="text-white text-sm font-medium tracking-tight">Beyond Seven Studios</span>
        </div>
      </motion.div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.12] pointer-events-none"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="w-full max-w-5xl text-center space-y-8 relative z-10">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[2.25rem] sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.95]"
          >
            Still wearing every hat in your business?
            <br />
            There&apos;s a faster way.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground leading-snug max-w-2xl mx-auto"
          >
            Give me 60 seconds and I&apos;ll show you exactly where your
            business is leaking time. And whether AI can plug the gaps.
          </motion.p>

          {/* Video placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-xl mx-auto aspect-video rounded-2xl bg-secondary border border-border flex items-center justify-center overflow-hidden"
          >
            <div className="text-center space-y-3">
              <div className="size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto cursor-pointer hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 ml-1">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Watch the 30-second intro</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 h-16 px-14 rounded-full bg-primary text-primary-foreground font-bold text-lg cursor-pointer uppercase tracking-wider
                         hover:opacity-80 active:scale-[0.98] transition-all duration-200"
            >
              Assess My Business
            </button>
          </motion.div>

          {/* Social proof with dividers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex items-center justify-center pt-6"
          >
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight"><CountUp target={52} suffix="K+" /></p>
              <p className="text-sm text-muted-foreground mt-1">followers</p>
            </div>
            <div className="w-px h-12 bg-foreground/20" />
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight"><CountUp target={6} /></p>
              <p className="text-sm text-muted-foreground mt-1">apps built with AI</p>
            </div>
            <div className="w-px h-12 bg-foreground/20" />
            <div className="text-center px-8 sm:px-12">
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight"><CountUp target={1600} suffix="+" /></p>
              <p className="text-sm text-muted-foreground mt-1">community members</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
