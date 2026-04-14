"use client";

import { useState } from "react";
import type { FormData } from "@/lib/quiz-config";

interface DfyResultProps {
  formData: FormData;
  insight?: string;
}

export function DfyResult({ formData, insight }: DfyResultProps) {
  const [view, setView] = useState<"primary" | "skool" | "declined">("primary");

  // TODO: Reintroduce email course option later
  // Change "declined" to "course" and uncomment EmailCourseConfirmation when ready

  if (view === "declined") {
    return (
      <div className="min-h-screen bg-background text-foreground px-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="size-20 rounded-full bg-foreground flex items-center justify-center mx-auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-9 text-background">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13L2 4" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            No worries{formData.name ? `, ${formData.name}` : ""}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            We&apos;ll send your results to your email so you can come back to them anytime.
          </p>
        </div>
      </div>
    );
  }

  /*
  // HIDDEN: Email course confirmation - reintroduce when 5-day course is ready
  if (view === "course") {
    return (
      <div className="min-h-screen bg-background text-foreground px-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="size-20 rounded-full bg-foreground flex items-center justify-center mx-auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-9 text-background">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13L2 4" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Day 1 is on its way{formData.name ? `, ${formData.name}` : ""}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Check your inbox in the next few minutes. Five days of practical AI
            lessons you can actually use in your business.
          </p>
        </div>
      </div>
    );
  }
  */

  if (view === "skool") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-lg mx-auto px-6 py-16 space-y-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Alternative path
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.1]">
              Build it yourself{formData.name ? `, ${formData.name}` : ""}?
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you&apos;d rather learn and build your own AI systems,
              the community gives you everything you need. Courses, templates,
              live support, and other builders to learn alongside.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-bold">AI Founders Studio</p>
              <p className="text-sm text-muted-foreground">$69/month. Cancel anytime.</p>
            </div>
            <button
              onClick={() => window.open("https://www.skool.com/ai-apps-builder-6217/about", "_blank")}
              className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base cursor-pointer
                         hover:opacity-80 active:scale-[0.98] transition-all duration-200"
            >
              Join AI Founders Studio
            </button>
            <button
              onClick={() => setView("declined")}
              className="w-full text-sm text-muted-foreground hover:text-foreground/80 transition-colors cursor-pointer py-1"
            >
              No thank you
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-6 py-16 space-y-10">

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Your result
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.1]">
            You don&apos;t need to learn this{formData.name ? `, ${formData.name}` : ""}. You need it done.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight || "Your answers tell us you know what your business needs. You just don't have the time or interest in becoming the person who builds it. That's smart, not lazy."}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            What stood out from your answers
          </p>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            {(formData.monthly_revenue === "20k_50k" || formData.monthly_revenue === "50k_100k" || formData.monthly_revenue === "100k_plus") && (
              <p>Your revenue means you can invest in systems that free up your time instead of spending months learning to build them.</p>
            )}
            {formData.monthly_revenue === "5k_20k" && (
              <p>You&apos;ve got a working business. The right systems now could be the difference between staying at this level and breaking through.</p>
            )}
            {(formData.time_available === "under_2hrs" || formData.time_available === "2_5hrs") && (
              <p>You don&apos;t have 10 hours a week to learn a new skill. Every hour you spend building is an hour not spent on revenue.</p>
            )}
            {formData.bottleneck === "need_app" && (
              <p>You need something custom built. That&apos;s not a YouTube tutorial problem, that&apos;s an engineering problem.</p>
            )}
            {formData.bottleneck === "operations" && (
              <p>Messy operations cost you more every single day you don&apos;t fix them. Automating this pays for itself fast.</p>
            )}
            {formData.urgency === "asap" && (
              <p>You want to move now, not in three months after a course. We can have something running in weeks.</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Who builds it
          </p>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
              JW
            </div>
            <div>
              <p className="text-sm font-bold">James Wild</p>
              <p className="text-xs text-muted-foreground">Beyond Seven Studios</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We build AI systems for businesses. Chatbots, voice agents, lead
            capture, automations, custom apps. You tell us the problem, we
            build the solution.
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-px bg-border" />
          <p className="text-sm text-muted-foreground">
            Book a free 30-minute call. We&apos;ll look at your answers, talk
            through what would actually move the needle, and give you a plan.
            No pitch if it&apos;s not a fit.
          </p>
          <button
            onClick={() => window.open("https://calendly.com/jamesmwild", "_blank")}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base cursor-pointer
                       hover:opacity-80 active:scale-[0.98] transition-all duration-200"
          >
            Book a Free Strategy Call
          </button>
          <button
            onClick={() => setView("skool")}
            className="w-full text-sm text-muted-foreground hover:text-foreground/80 transition-colors cursor-pointer py-1"
          >
            I&apos;d rather build it myself
          </button>
        </div>

      </div>
    </div>
  );
}
