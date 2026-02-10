import { NextResponse } from "next/server";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/adminSession";

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    await clearAdminSession();
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true });
}
