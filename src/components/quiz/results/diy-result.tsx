"use client";

import { useState } from "react";
import type { FormData } from "@/lib/quiz-config";

interface DiyResultProps {
  formData: FormData;
  insight?: string;
}

export function DiyResult({ formData, insight }: DiyResultProps) {
  const [declined, setDeclined] = useState(false);

  if (declined) {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-6 py-16 space-y-10">

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Your result
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.1]">
            You&apos;re a builder{formData.name ? `, ${formData.name}` : ""}.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight || "You want to learn this yourself, own the systems, and not depend on anyone else. That's the right instinct."}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            What stood out from your answers
          </p>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            {formData.time_available === "5_10hrs" || formData.time_available === "10plus_hrs" ? (
              <p>You&apos;ve got time to put into this. That matters more than most people think.</p>
            ) : (
              <p>Time is tight for you right now. The right system means less wasted hours.</p>
            )}
            {formData.ai_comfort === "clear" || formData.ai_comfort === "general_idea" || formData.ai_comfort === "advanced" ? (
              <p>You already have a sense of how AI fits into your business. Most people don&apos;t get that far before they start.</p>
            ) : (
              <p>You&apos;re earlier on the AI journey, but that&apos;s a good thing. You&apos;ll skip the mistakes most people make when they dive in without a system.</p>
            )}
            {formData.business_type === "solo" && (
              <p>As a solo operator, the biggest unlock is building systems that do the work you keep repeating. That&apos;s exactly what we teach.</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            The gap
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Knowing you want to build is step one. The hard part is knowing
            <span className="text-foreground font-medium"> what to build first</span>,
            in <span className="text-foreground font-medium">what order</span>, and
            how to avoid spending weeks going down the wrong path.
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-px bg-border" />
          <div className="space-y-2">
            <p className="font-bold">AI Founders Studio</p>
            <p className="text-sm text-muted-foreground">
              Courses, templates, community, weekly live sessions. Everything
              you need to build AI systems into your business. $69/month.
            </p>
          </div>
          <button
            onClick={() => window.open("https://www.skool.com/ai-apps-builder-6217/about", "_blank")}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base cursor-pointer
                       hover:opacity-80 active:scale-[0.98] transition-all duration-200"
          >
            Join AI Founders Studio
          </button>
          <button
            onClick={() => setDeclined(true)}
            className="w-full text-sm text-muted-foreground hover:text-foreground/80 transition-colors cursor-pointer py-1"
          >
            No thank you
          </button>
        </div>

      </div>
    </div>
  );
}
