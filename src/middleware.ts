import { NextResponse, type NextRequest } from "next/server";

/**
 * Logged-in areas need the session cookie set by the Sojao API (`sojao_session`). This only checks
 * that it exists; the API validates it on every request and a stale one bounces back to /login.
 */
export function middleware(req: NextRequest) {
  if (req.cookies.get("sojao_session")?.value) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/onboarding/:path*"] };
