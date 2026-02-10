import { cookies } from "next/headers";
import { deleteAdminSession, isAdminSessionValid } from "@/lib/db";

export const ADMIN_SESSION_COOKIE = "snacksandslay_admin_session";

export async function getAdminSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return sessionId ?? null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const sessionId = await getAdminSessionId();

  if (!sessionId) {
    return false;
  }

  return await isAdminSessionValid(sessionId);
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function clearAdminSession(): Promise<void> {
  const sessionId = await getAdminSessionId();

  if (sessionId) {
    await deleteAdminSession(sessionId);
  }

  await clearAdminSessionCookie();
}
