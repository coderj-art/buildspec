"use client";

import { motion } from "motion/react";
import { EmailGateForm } from "./email-gate-form";

interface LandingStepProps {
  onEmailSubmit: (name: string, email: string) => Promise<void>;
}

export function LandingStep({ onEmailSubmit }: LandingStepProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Ambient gradient bars — premium depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[28rem] -right-[20rem] flex gap-[6rem] rotate-[-18deg] blur-[5rem] skew-x-[-30deg] opacity-[0.45] z-0"
      >
        <div className="w-[8rem] h-[30rem] bg-gradient-to-b from-primary via-primary/30 to-transparent" />
        <div className="w-[8rem] h-[34rem] bg-gradient-to-b from-accent via-accent/20 to-transparent" />
        <div className="w-[8rem] h-[30rem] bg-gradient-to-b from-primary/80 via-primary/10 to-transparent" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[30rem] -left-[10rem] flex gap-[6rem] rotate-[-18deg] blur-[5rem] skew-x-[-30deg] opacity-[0.35] z-0"
      >
        <div className="w-[8rem] h-[30rem] bg-gradient-to-t from-accent/80 via-accent/20 to-transparent" />
        <div className="w-[8rem] h-[28rem] bg-gradient-to-t from-primary via-primary/10 to-transparent" />
      </div>

      {/* Subtle grain / noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] z-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full px-6 sm:px-10 pt-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 bg-card/70 backdrop-blur-md border border-border rounded-full pl-1.5 pr-4 py-1.5">
          <div className="size-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-[11px] font-bold tracking-wider">
              BS
            </span>
          </div>
          <span className="text-foreground text-sm font-semibold tracking-tight">
            BUILDSPEC
          </span>
          <span className="w-px h-3.5 bg-border" />
          <span className="text-xs text-muted-foreground tracking-wider uppercase">
            Free
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span className="uppercase tracking-wider">1,600+ builders</span>
        </div>
      </motion.nav>

      <main className="relative z-10 flex-1 flex items-center px-6 sm:px-10 py-12">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* LEFT: hero content */}
          <div className="space-y-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary font-semibold bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5"
            >
              <span className="size-1 rounded-full bg-primary" />
              For Claude Code builders
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
            >
              <span className="font-extrabold">Nail your first</span>{" "}
              <span className="font-serif-italic text-primary relative inline-block">
                build
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary/0 rounded-full"
                />
              </span>
              <span className="font-extrabold">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base sm:text-lg text-foreground/75 leading-relaxed max-w-md"
            >
              Most people waste months picking what to build with Claude
              Code. Answer 10 questions and get a personalised one-page spec
              for the exact tool you should build first. In under 10 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-2">
                {["#E07A5F", "#F4A261", "#81B29A", "#3D405B"].map((c, i) => (
                  <div
                    key={i}
                    className="size-9 rounded-full border-2 border-background ring-1 ring-white/5"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="text-foreground/90">
                  <span className="font-semibold">1,600+ founders</span>{" "}
                  already building
                </p>
                <p className="text-xs text-muted-foreground">
                  From solo devs to 50-person teams
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden sm:flex items-center gap-6 pt-4 text-xs text-muted-foreground uppercase tracking-wider"
            >
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary" />
                Under 10 minutes
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary" />
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary" />
                22-day plan included
              </span>
            </motion.div>
          </div>

          {/* RIGHT: email capture card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full relative"
          >
            {/* Glow behind card */}
            <div
              aria-hidden
              className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-accent/10 to-primary/20 blur-2xl rounded-[2.5rem] -z-10"
            />
            <div className="relative bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-7 sm:p-9 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="space-y-1.5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold bg-primary/10 rounded px-2 py-0.5">
                    Step 1 of 3
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ~10 seconds
                  </span>
                </div>
                <h2 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight">
                  Get your build spec.
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your details. We&apos;ll send a verification code.
                </p>
              </div>
              <EmailGateForm onSubmit={onEmailSubmit} />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-5 px-4">
              By continuing you&apos;ll also get my 22-day Claude Code build
              plan. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative z-10 w-full px-6 sm:px-10 py-5 border-t border-border flex items-center justify-between text-xs text-muted-foreground"
      >
        <span className="tracking-wider font-semibold">BUILDSPEC™</span>
        <span>by James Wild · 2026</span>
      </motion.footer>
    </div>
  );
}
