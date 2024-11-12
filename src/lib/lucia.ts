import { lucia, type Session as SessionType } from "lucia";
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

export const getSession = cache(async (): Promise<SessionType> => {
  const authRequest = auth.handleRequest("GET", context);
  return await authRequest.validate();
});

export enum ErrorMessage {
  INVALID_SESSION_ID = "AUTH_INVALID_SESSION_ID",
  INVALID_PASSWORD = "AUTH_INVALID_PASSWORD",
  DUPLICATE_KEY_ID = "AUTH_DUPLICATE_KEY_ID",
  INVALID_KEY_ID = "AUTH_INVALID_KEY_ID",
  INVALID_USER_ID = "AUTH_INVALID_USER_ID",
  INVALID_REQUEST = "AUTH_INVALID_REQUEST",
  NOT_AUTHENTICATED = "AUTH_NOT_AUTHENTICATED",
  UNAUTHORIZED = "REQUEST_UNAUTHORIZED",
  UNKNOWN = "UNKNOWN_ERROR",
  OUTDATED_PASSWORD = "AUTH_OUTDATED_PASSWORD",
}
