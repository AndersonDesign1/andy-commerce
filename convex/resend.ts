"use node";

import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/render";
import { v } from "convex/values";
import { OTPEmail } from "../emails/otp-email";
import { ResetPassword } from "../emails/reset-password";
import { VerifyEmail } from "../emails/verify-email";
import { components } from "./_generated/api";
import { internalAction } from "./_generated/server";

// Initialize the Convex Resend component
// Set testMode to false to send emails to real addresses
export const resend = new Resend(components.resend, {
  testMode: false,
});

const FROM_EMAIL = "Flik <noreply@notification.flikapp.xyz>";

/**
 * Send an OTP verification email using React Email template
 * This can be called from mutations/actions that need to send OTP emails
 */
export const sendOTPEmail = internalAction({
  args: {
    to: v.string(),
    otp: v.string(),
    userName: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const html = await render(
      OTPEmail({ otp: args.otp, userName: args.userName })
    );

    await resend.sendEmail(ctx, {
      from: FROM_EMAIL,
      to: args.to,
      subject: args.subject ?? "Your Flik verification code",
      html,
    });

    return null;
  },
});

/**
 * Send an email verification email using React Email template
 */
export const sendVerificationEmail = internalAction({
  args: {
    to: v.string(),
    url: v.string(),
    userName: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const html = await render(
      VerifyEmail({ url: args.url, userName: args.userName })
    );

    await resend.sendEmail(ctx, {
      from: FROM_EMAIL,
      to: args.to,
      subject: "Verify your Flik email",
      html,
    });

    return null;
  },
});

/**
 * Send a password reset email using React Email template
 */
export const sendPasswordResetEmail = internalAction({
  args: {
    to: v.string(),
    url: v.string(),
    userName: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const html = await render(
      ResetPassword({ url: args.url, userName: args.userName })
    );

    await resend.sendEmail(ctx, {
      from: FROM_EMAIL,
      to: args.to,
      subject: "Reset your Flik password",
      html,
    });

    return null;
  },
});
