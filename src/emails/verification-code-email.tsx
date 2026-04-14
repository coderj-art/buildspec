import * as React from "react";

interface VerificationCodeEmailProps {
  name: string;
  code: string;
}

export function VerificationCodeEmail({
  name,
  code,
}: VerificationCodeEmailProps) {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        maxWidth: 560,
        margin: "0 auto",
        padding: 24,
        color: "#111",
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>
        Hey {name}, here&apos;s your code.
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, margin: "12px 0" }}>
        Pop this into BuildSpec to unlock your quiz and get your build plan.
      </p>
      <div
        style={{
          fontSize: 36,
          letterSpacing: 10,
          fontWeight: 700,
          padding: "20px 0",
          textAlign: "center",
          background: "#f4f4f5",
          borderRadius: 8,
          margin: "24px 0",
        }}
      >
        {code}
      </div>
      <p style={{ fontSize: 14, color: "#666" }}>
        This code expires in 10 minutes. If you didn&apos;t request it, ignore
        this email.
      </p>
      <p style={{ fontSize: 14, color: "#666", marginTop: 32 }}>JW</p>
    </div>
  );
}
