import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { emailOTP, twoFactor } from "better-auth/plugins";
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

function getOAuthEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(
      `[Auth Warning] OAuth env var ${name} is not set. ` +
        "The corresponding OAuth provider will not work."
    );
  }
  return value ?? "";
}

const convexSiteUrl = getRequiredEnv("CONVEX_SITE_URL");

export const authComponent = createClient<DataModel>(components.betterAuth);

async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY not configured. Please set the RESEND_API_KEY environment variable."
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Flik <noreply@notification.flikapp.xyz>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Failed to send verification email. Please try again later."
    );
  }
}

function generateOTPEmailHTML(otp: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; margin: 0; padding: 40px 0;">
  <div style="background-color: #ffffff; margin: 0 auto; padding: 40px 20px; border-radius: 8px; max-width: 465px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 40px; height: 40px; background-color: #7c3aed; border-radius: 10px; color: #ffffff; font-size: 20px; font-weight: bold; line-height: 40px; text-align: center; vertical-align: middle;">F</div>
      <span style="display: inline-block; margin-left: 8px; font-size: 24px; font-weight: bold; color: #1a1a1a; vertical-align: middle;">Flik</span>
    </div>

    <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 24px;">Verification Code</h1>

    <p style="color: #525f7f; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
      ${userName ? `Hi ${userName},` : "Hi there,"}
    </p>

    <p style="color: #525f7f; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
      Enter the following code to verify your identity:
    </p>

    <div style="background-color: #f4f4f5; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="color: #7c3aed; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${otp}</p>
    </div>

    <p style="color: #525f7f; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
      This code expires in 10 minutes. If you didn't request this code, you can safely ignore this email.
    </p>

    <p style="color: #8898aa; font-size: 12px; text-align: center; margin-top: 32px;">
      © ${new Date().getFullYear()} Flik. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    appName: "Flik",
    baseURL: convexSiteUrl,
    database: authComponent.adapter(ctx),
    trustedOrigins: [
      "http://localhost:3000",
      "https://flikapp.xyz",
      "https://www.flikapp.xyz",
      convexSiteUrl,
    ],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    socialProviders: {
      google: {
        clientId: getOAuthEnv("GOOGLE_CLIENT_ID"),
        clientSecret: getOAuthEnv("GOOGLE_CLIENT_SECRET"),
      },
      github: {
        clientId: getOAuthEnv("GITHUB_CLIENT_ID"),
        clientSecret: getOAuthEnv("GITHUB_CLIENT_SECRET"),
      },
    },
    plugins: [
      convex({ authConfig }),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          let subject = "Your Flik verification code";
          if (type === "email-verification") {
            subject = "Verify your Flik email";
          } else if (type === "forget-password") {
            subject = "Reset your Flik password";
          }
          const html = generateOTPEmailHTML(otp);
          await sendEmailViaResend(email, subject, html);
        },
      }),
      twoFactor({
        otpOptions: {
          async sendOTP({ user, otp }) {
            const html = generateOTPEmailHTML(otp, user.name);
            await sendEmailViaResend(
              user.email,
              "Your Flik verification code",
              html
            );
          },
        },
      }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.string(),
      name: v.optional(v.string()),
      email: v.string(),
      emailVerified: v.boolean(),
      image: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }
    return {
      _id: user._id,
      name: user.name ?? undefined,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});
