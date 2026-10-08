import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password, remember } = await request.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const { rows } = await db.query<{ id: string; email: string; name: string; password_hash: string }>(
    "select id, email, name, password_hash from app_users where email = $1",
    [email.trim().toLowerCase()],
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return Response.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await db.query("update app_users set last_login_at = now() where id = $1", [user.id]);
  await createSession(user.id, remember !== false);
  return Response.json({ user: { id: user.id, email: user.email, name: user.name } });
}
