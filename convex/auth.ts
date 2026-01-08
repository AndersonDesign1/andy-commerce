import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnv(name: string, defaultValue = ""): string {
  return process.env[name] ?? defaultValue;
}

const convexSiteUrl = getRequiredEnv("CONVEX_SITE_URL");

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    appName: "Flik",
    baseURL: convexSiteUrl,
    database: authComponent.adapter(ctx),
    trustedOrigins: [
      "http://localhost:3000",
      "https://flikapp.xyz",
      "https://www.flikapp.xyz",
    ],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: getOptionalEnv("GOOGLE_CLIENT_ID"),
        clientSecret: getOptionalEnv("GOOGLE_CLIENT_SECRET"),
      },
      github: {
        clientId: getOptionalEnv("GITHUB_CLIENT_ID"),
        clientSecret: getOptionalEnv("GITHUB_CLIENT_SECRET"),
      },
    },
    plugins: [
      convex({ authConfig }),
      twoFactor({
        otpOptions: {
          sendOTP({ user, otp }) {
            // TODO: Implement OTP email sending via Resend
            console.log(`OTP for ${user.email}: ${otp}`);
          },
        },
      }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    return user ?? null;
  },
});
