import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "studypilot_session";
const SESSION_DAYS = 30;

export type AuthUser = { id: string; email: string; name: string };

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string, remember: boolean) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.query("insert into app_sessions (token_hash, user_id, expires_at) values ($1, $2, $3)", [hashToken(token), userId, expires]);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // Without "remember me" the cookie ends with the browser session.
    ...(remember ? { expires } : {}),
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const { rows } = await db.query<AuthUser>(
    `select u.id, u.email, u.name from app_sessions s join app_users u on u.id = s.user_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.query("delete from app_sessions where token_hash = $1", [hashToken(token)]);
  store.delete(SESSION_COOKIE);
}
