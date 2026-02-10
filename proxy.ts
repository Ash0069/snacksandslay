import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = process.env.ADMIN_SESSION_COOKIE;

export function proxy(request: NextRequest) {
  if (!ADMIN_SESSION_COOKIE) {
    throw new Error("Missing ADMIN_SESSION_COOKIE env variable");
  }

  const { pathname } = request.nextUrl;

  const hasSessionCookie = Boolean(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  );

  if (pathname.startsWith("/admin/cms") && !hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin/login") && hasSessionCookie) {
    const cmsUrl = new URL("/admin/cms", request.url);
    return NextResponse.redirect(cmsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};