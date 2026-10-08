import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { name, email, password, remember } = await request.json().catch(() => ({}));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const { rows } = await db.query<{ id: string; email: string; name: string }>(
    `insert into app_users (email, name, password_hash) values ($1, $2, $3)
     on conflict (email) do nothing returning id, email, name`,
    [email.trim().toLowerCase(), typeof name === "string" ? name.trim() : "", await bcrypt.hash(password, 10)],
  );
  if (!rows[0]) return Response.json({ error: "An account with this email already exists." }, { status: 409 });

  await createSession(rows[0].id, remember !== false);
  return Response.json({ user: rows[0] }, { status: 201 });
}
