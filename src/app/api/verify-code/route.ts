import { z } from "zod";
import { cookies } from "next/headers";
import { verifyCode } from "@/lib/otp-store";
import {
  issueSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/jwt";
import { findOrCreateSubscriber, tagSubscriberByName } from "@/lib/convertkit";

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

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

    const { name, email, code } = parsed.data;
    const result = await verifyCode(email, code);
    if (!result.ok) {
      return Response.json(
        { ok: false, error: result.reason ?? "Invalid code" },
        { status: 400 }
      );
    }

    // Kit: create subscriber + tag as 'buildspec_started' (fire-and-forget safe)
    if (process.env.CONVERTKIT_API_KEY) {
      try {
        const subscriber = await findOrCreateSubscriber(email, name);
        await tagSubscriberByName(subscriber.id, "buildspec_started");
      } catch (e) {
        console.error("Kit tag (started) failed:", e);
        // Non-fatal — still let them into the quiz
      }
    }

    const token = await issueSessionToken(email, name);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("verify-code error:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
