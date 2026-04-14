"use client";

import { useState, FormEvent } from "react";

interface TextInputStepProps {
  question: string;
  subtitle?: string;
  placeholder: string;
  onSubmit: (value: string) => void;
  defaultValue?: string;
  type?: "text" | "url";
}

export function TextInputStep({
  question,
  subtitle,
  placeholder,
  onSubmit,
  defaultValue = "",
  type = "text",
}: TextInputStepProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (type === "url") {
      let url = value.trim();
      if (!url) {
        setError("Please enter a URL");
        return;
      }
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
      onSubmit(url);
    } else {
      if (!value.trim()) {
        setError("This field is required");
        return;
      }
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]">
          {question}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-base">{subtitle}</p>
        )}
      </div>
      <div className="space-y-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={type}
          className="w-full h-14 px-6 rounded-full border border-border bg-white text-foreground text-base
                     outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
          autoFocus
        />
        {error && <p className="text-sm text-destructive pl-4">{error}</p>}
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold text-base cursor-pointer
                   hover:opacity-80 active:scale-[0.98] transition-all duration-200"
      >
        Continue

      </button>
    </form>
  );
}
