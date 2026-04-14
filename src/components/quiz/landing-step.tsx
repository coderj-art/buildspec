"use client";

import { motion } from "motion/react";
import { EmailGateForm } from "./email-gate-form";

interface LandingStepProps {
  onEmailSubmit: (name: string, email: string) => Promise<void>;
}

export function LandingStep({ onEmailSubmit }: LandingStepProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full px-6 sm:px-10 pt-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-[11px] font-bold tracking-wider">
              BS
            </span>
          </div>
          <span className="text-foreground text-sm font-semibold tracking-tight">
            BUILDSPEC
          </span>
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Free tool
        </span>
      </motion.nav>

      <main className="flex-1 flex items-center px-6 sm:px-10 py-10">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="space-y-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="inline-block text-xs uppercase tracking-[0.22em] text-primary font-semibold"
            >
              BuildSpec™
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
            >
              <span className="font-extrabold">Nail your first</span>
              <br />
              <span className="font-serif-italic text-primary">
                build
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
              className="flex items-center gap-3 pt-2"
            >
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-8 rounded-full border-2 border-background"
                    style={{
                      background: [
                        "#E07A5F",
                        "#81B29A",
                        "#F2CC8F",
                        "#3D405B",
                      ][i],
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by{" "}
                <span className="text-foreground font-semibold">1,600+</span>{" "}
                founders
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full"
          >
            <div className="bg-card border border-border rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/30">
              <div className="space-y-1.5 mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  Get started for free
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your details to build your spec.
                </p>
              </div>
              <EmailGateForm onSubmit={onEmailSubmit} />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing you agree to receive a 22-day build plan. Unsubscribe
              anytime.
            </p>
          </motion.div>
        </div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full px-6 sm:px-10 py-5 border-t border-border flex items-center justify-between text-xs text-muted-foreground"
      >
        <span className="tracking-wider">BUILDSPEC™</span>
        <span>by James Wild</span>
      </motion.footer>
    </div>
  );
}