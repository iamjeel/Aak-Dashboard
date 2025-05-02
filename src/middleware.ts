// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPath) {
    if (!token || !["admin", "warehouseAdmin"].includes(token.role as string)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Only match /admin routes
export const config = {
  matcher: ["/admin/dashboard"],
};
