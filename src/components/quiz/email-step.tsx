"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import type { FormData } from "@/lib/quiz-config";

const emailSchema = z.string().email("Please enter a valid email address");

interface EmailStepProps {
  onSubmit: (email: string, name: string, subscriberId: number) => void;
  formData: FormData;
  segment: string;
}

export function EmailStep({ onSubmit, formData, segment }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      onSubmit(email.trim(), name.trim(), data.subscriberId);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const segmentLabel = segment === "dfy" ? "Full Service" : segment === "dwy" ? "Guided" : "Builder";

  return (
    <div className="min-h-screen relative">
      {/* Blurred results preview behind */}
      <div className="absolute inset-0 overflow-hidden blur-md opacity-40 pointer-events-none select-none">
        <div className="max-w-lg mx-auto px-6 pt-20 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm font-semibold">
              {segmentLabel}
            </div>
            <div className="h-8 bg-secondary rounded-lg w-3/4 mx-auto" />
            <div className="h-8 bg-secondary rounded-lg w-1/2 mx-auto" />
            <div className="h-4 bg-secondary/60 rounded w-2/3 mx-auto mt-4" />
            <div className="h-4 bg-secondary/60 rounded w-3/4 mx-auto" />
          </div>
          <div className="space-y-4 mt-8">
            <div className="h-3 bg-secondary/40 rounded w-1/3" />
            <div className="h-4 bg-secondary/50 rounded w-full" />
            <div className="h-4 bg-secondary/50 rounded w-5/6" />
            <div className="h-4 bg-secondary/50 rounded w-4/5" />
          </div>
          <div className="space-y-4 mt-8">
            <div className="h-3 bg-secondary/40 rounded w-1/4" />
            <div className="h-4 bg-secondary/50 rounded w-full" />
            <div className="h-4 bg-secondary/50 rounded w-3/4" />
          </div>
        </div>
      </div>

      {/* Email + name gate overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6 border border-border">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.1]">
                Your results are ready.
              </h2>
              <p className="text-muted-foreground text-base">
                Enter your details to see your personalised report. You&apos;ll
                also get a free 5-day AI implementation course.
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground text-base
                           outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                autoFocus
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground text-base
                           outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
              />
              {error && <p className="text-sm text-destructive pl-4">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base cursor-pointer
                         hover:opacity-80 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : "See My Results"}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
