import { SignJWT, jwtVerify } from "jose";

const JWT_TTL_SECONDS = 30 * 60; // 30 minutes

function getSecret(): Uint8Array {
  const secret = process.env.OTP_JWT_SECRET;
  if (!secret) {
    throw new Error("OTP_JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  email: string;
  name: string;
  verified: true;
}

export async function issueSessionToken(
  email: string,
  name: string
): Promise<string> {
  return new SignJWT({ email, name, verified: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      payload.verified === true
    ) {
      return {
        email: payload.email,
        name: payload.name,
        verified: true,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = "buildspec_session";
export const SESSION_COOKIE_MAX_AGE = JWT_TTL_SECONDS;
