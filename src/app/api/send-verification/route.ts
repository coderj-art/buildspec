import { z } from "zod";
import { Resend } from "resend";
import { cookies } from "next/headers";
import { generateCode } from "@/lib/otp";
import { storeCode, checkIpRateLimit } from "@/lib/otp-store";
import { VerificationCodeEmail } from "@/emails/verification-code-email";
import {
  issueSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/jwt";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Valid email required"),
});

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    // Server-side bypass for testing — skips OTP entirely, issues JWT directly.
    // Controlled by BYPASS_OTP env var. Remove in production.
    if (process.env.BYPASS_OTP === "true") {
      const token = await issueSessionToken(email, name);
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_COOKIE_MAX_AGE,
        path: "/",
      });
      return Response.json({ ok: true, bypassed: true });
    }

    // IP rate limit
    const ip = getClientIp(request);
    const rate = await checkIpRateLimit(ip);
    if (!rate.ok) {
      return Response.json(
        { ok: false, error: "Too many code requests. Try again later." },
        { status: 429 }
      );
    }

    const code = generateCode();
    await storeCode(email, code);

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "BuildSpec <james@jamesmwild.com>";

    if (!resendApiKey) {
      // Dev fallback: log code to server console
      console.log(`[DEV] Verification code for ${email}: ${code}`);
      return Response.json({ ok: true, dev: true });
    }

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your BuildSpec code: ${code}`,
      react: VerificationCodeEmail({ name, code }),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { ok: false, error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("send-verification error:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
