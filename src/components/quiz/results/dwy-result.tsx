"use client";

import { useState } from "react";
import type { FormData } from "@/lib/quiz-config";

interface DwyResultProps {
  formData: FormData;
  insight?: string;
}

export function DwyResult({ formData, insight }: DwyResultProps) {
  const [declined, setDeclined] = useState(false);

  // TODO: Reintroduce email course option later
  // Change declined state to "course" flow and uncomment when 5-day course is ready

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
            You want to do the work{formData.name ? `, ${formData.name}` : ""}. Just not alone.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight || "You're willing to build this yourself, but you want someone who's done it before telling you what to focus on and what to skip. That's the fastest path."}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            What stood out from your answers
          </p>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            {formData.ai_comfort === "general_idea" && (
              <p>You have a sense of where AI fits. The gap isn&apos;t knowledge, it&apos;s knowing which steps to take in which order.</p>
            )}
            {formData.ai_comfort === "unclear" && (
              <p>You&apos;re honest about not knowing where to start. That self-awareness is rare. Most people waste months trying random tools before admitting they need direction.</p>
            )}
            {(formData.time_available === "2_5hrs" || formData.time_available === "5_10hrs") && (
              <p>You have enough time to make real progress each week. With the right guidance, that&apos;s more than enough.</p>
            )}
            {formData.bottleneck === "marketing" && (
              <p>Marketing is one of the first things we help people automate. High-impact, fast results.</p>
            )}
            {formData.business_type === "solo" && (
              <p>Solo operators get the most out of guided support. No team to bounce ideas off means the community fills that gap.</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            The gap
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Trial and error is expensive. Not in money, in
            <span className="text-foreground font-medium"> time</span>. The people
            who move fastest aren&apos;t smarter. They just have someone
            pointing them in the right direction.
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-px bg-border" />
          <div className="space-y-2">
            <p className="font-bold">AI Founders Studio</p>
            <p className="text-sm text-muted-foreground">
              Step-by-step courses, weekly live sessions with me, a community
              of builders, and guided support when you get stuck. $69/month.
            </p>
          </div>
          <button
            onClick={() => window.open("https://www.skool.com/ai-apps-builder-6217/about", "_blank")}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base cursor-pointer
                       hover:opacity-80 active:scale-[0.98] transition-all duration-200"
          >
            Get Priority Access
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
