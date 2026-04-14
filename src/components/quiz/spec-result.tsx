"use client";

import { motion } from "motion/react";
import type { BuildSpec } from "@/lib/types";

interface SpecResultProps {
  spec: BuildSpec;
  name: string;
}

export function SpecResult({ spec, name }: SpecResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-10 py-12"
    >
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          {name}, here&apos;s your build
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
          {spec.name}
        </h1>
        <p className="text-xl text-foreground/80">{spec.oneLiner}</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
          For
        </h2>
        <p className="text-lg">{spec.targetUser}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
          Core features
        </h2>
        <ul className="space-y-2">
          {spec.coreFeatures.map((f, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-primary font-semibold">{i + 1}.</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 bg-secondary/50 rounded-2xl p-6">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
          Why this one first
        </h2>
        <p className="text-foreground/90 leading-relaxed">{spec.whyThisFirst}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
          Tech stack
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Primary:</span> {spec.techStack.primary}
          </p>
          {spec.techStack.mcps.length > 0 && (
            <p>
              <span className="font-medium">MCPs / skills:</span>{" "}
              {spec.techStack.mcps.join(", ")}
            </p>
          )}
          {spec.techStack.integrations.length > 0 && (
            <p>
              <span className="font-medium">Integrations:</span>{" "}
              {spec.techStack.integrations.join(", ")}
            </p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
          Your 5-week build path
        </h2>
        <div className="space-y-3">
          {spec.milestones.map((m) => (
            <div
              key={m.week}
              className="flex gap-4 border-l-2 border-primary pl-4 py-1"
            >
              <div className="flex-shrink-0 w-16">
                <div className="text-xs uppercase text-muted-foreground">
                  Week {m.week}
                </div>
                <div className="font-semibold">{m.title}</div>
              </div>
              <div className="flex-1 text-foreground/80">{m.deliverable}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground pt-2">
          Estimated time to ship: {spec.estimatedTimeToShip}
        </p>
      </section>

      <section className="bg-foreground text-background rounded-3xl p-8 space-y-4">
        <h2 className="text-2xl font-bold">Starting tomorrow.</h2>
        <p className="text-background/80">
          You&apos;ll get one email a day for 22 days. My actual process. Real
          builds. The next one lands in your inbox at 8am.
        </p>
        <a
          href="https://skool.com/ai-founders-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 h-14 leading-[56px] rounded-full bg-background text-foreground font-semibold cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Join AI Founders Studio
        </a>
        <p className="text-xs text-background/60">
          $49/month founding. 90-day money-back guarantee.
        </p>
      </section>
    </motion.div>
  );
}
