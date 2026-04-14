import { Redis } from "@upstash/redis";
import { hashCode, timingSafeCompare } from "./otp";

const redis = Redis.fromEnv();

const CODE_TTL_SECONDS = 600; // 10 minutes
const ATTEMPT_TTL_SECONDS = 600;
const IP_RATE_TTL_SECONDS = 3600; // 1 hour

const MAX_SENDS_PER_IP_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS_PER_EMAIL = 5;

interface StoredCode {
  codeHash: string;
  expiresAt: number;
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function storeCode(email: string, code: string): Promise<void> {
  const key = `otp:${normaliseEmail(email)}`;
  const payload: StoredCode = {
    codeHash: hashCode(code),
    expiresAt: Date.now() + CODE_TTL_SECONDS * 1000,
  };
  await redis.set(key, JSON.stringify(payload), { ex: CODE_TTL_SECONDS });
}

export async function verifyCode(
  email: string,
  submittedCode: string
): Promise<{ ok: boolean; reason?: string }> {
  const normalised = normaliseEmail(email);
  const attemptKey = `otp:verify:${normalised}`;
  const codeKey = `otp:${normalised}`;

  const attempts = (await redis.incr(attemptKey)) as number;
  if (attempts === 1) {
    await redis.expire(attemptKey, ATTEMPT_TTL_SECONDS);
  }
  if (attempts > MAX_VERIFY_ATTEMPTS_PER_EMAIL) {
    return { ok: false, reason: "Too many attempts. Try again later." };
  }

  const raw = await redis.get(codeKey);
  if (!raw) {
    return { ok: false, reason: "Code expired. Request a new one." };
  }

  const stored: StoredCode =
    typeof raw === "string" ? JSON.parse(raw) : (raw as StoredCode);

  if (Date.now() > stored.expiresAt) {
    await redis.del(codeKey);
    return { ok: false, reason: "Code expired. Request a new one." };
  }

  const submittedHash = hashCode(submittedCode);
  if (!timingSafeCompare(submittedHash, stored.codeHash)) {
    return { ok: false, reason: "Incorrect code." };
  }

  // Success: clean up
  await Promise.all([redis.del(codeKey), redis.del(attemptKey)]);
  return { ok: true };
}

export async function checkIpRateLimit(ip: string): Promise<{
  ok: boolean;
  remaining: number;
}> {
  const key = `otp:rate:ip:${ip}`;
  const count = (await redis.incr(key)) as number;
  if (count === 1) {
    await redis.expire(key, IP_RATE_TTL_SECONDS);
  }
  const remaining = Math.max(0, MAX_SENDS_PER_IP_PER_HOUR - count);
  return {
    ok: count <= MAX_SENDS_PER_IP_PER_HOUR,
    remaining,
  };
}
