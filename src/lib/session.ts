// lib/withSession.js

import { withIronSessionApiRoute } from "iron-session/next";

export default function withSession(handler) {
  return withIronSessionApiRoute(handler, {
    password: process.env.SESSION_SECRET,
    cookieName: "next_app/session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
