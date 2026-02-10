import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { createAdminSession, validateAdminCredentials } from "@/lib/db";

type LoginPayload = {
  username?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let payload: LoginPayload;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = typeof payload.username === "string" ? payload.username.trim() : "";
  const password = typeof payload.password === "string" ? payload.password.trim() : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const sessionId = await createAdminSession();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ success: true });
}
