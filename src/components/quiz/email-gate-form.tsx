"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

interface EmailGateFormProps {
  onSubmit: (email: string, name: string, subscriberId: number) => void;
}

export function EmailGateForm({ onSubmit }: EmailGateFormProps) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {loading ? "Loading..." : "Reveal My Results"}
      </button>
      <p className="text-xs text-center text-muted-foreground">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
