"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpVerifyStepProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export function OtpVerifyStep({
  email,
  onVerify,
  onResend,
  onBack,
}: OtpVerifyStepProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const handleVerify = async (submitted: string) => {
    if (submitted.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      await onVerify(submitted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");
    try {
      await onResend();
      setResendMessage("New code sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resend failed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]"
        >
          Check your inbox.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-muted-foreground text-base"
        >
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </motion.p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(v) => {
            setCode(v);
            if (v.length === 6) handleVerify(v);
          }}
          disabled={loading}
          autoFocus
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-14 w-12 text-xl border-foreground/30"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {loading && (
        <p className="text-sm text-center text-muted-foreground">Verifying…</p>
      )}
      {error && (
        <p className="text-sm text-center text-destructive">{error}</p>
      )}
      {resendMessage && (
        <p className="text-sm text-center text-foreground/70">
          {resendMessage}
        </p>
      )}

      <div className="flex justify-center gap-6 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={handleResend}
          className="underline-offset-4 hover:underline cursor-pointer"
        >
          Resend code
        </button>
        <button
          type="button"
          onClick={onBack}
          className="underline-offset-4 hover:underline cursor-pointer"
        >
          Wrong email? Go back
        </button>
      </div>
    </div>
  );
}
