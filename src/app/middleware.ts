// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  const { user } = session;

  // Check if user is authenticated or not
  if (!user) {
    // User is not authenticated, redirect to login page or return an unauthorized response
    return NextResponse.redirect("/login");
  }

  return res;
};

export const config = {
  matcher: "/admin",
};
