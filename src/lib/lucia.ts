import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import { cache } from "react";
import * as context from "next/headers";

import connectDatabase from "@/lib/database";
import User from "@/lib/models/user";
import Key from "@/lib/models/key";
import Session from "@/lib/models/session";

connectDatabase().then();

export const auth = lucia({
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: { expires: false },
  adapter: mongoose({ User, Key, Session }),
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;

export const getSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});
