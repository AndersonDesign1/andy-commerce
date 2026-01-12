"use node";

import { render } from "@react-email/render";
import { v } from "convex/values";
import { Resend } from "resend";
import { OTPEmail } from "../emails/otp-email";
import { ResetPassword } from "../emails/reset-password";
import { VerifyEmail } from "../emails/verify-email";
import { internalAction } from "./_generated/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = internalAction({
  args: {
    to: v.string(),
    url: v.string(),
    userName: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (_ctx, args) => {
    try {
      const html = await render(
        VerifyEmail({ url: args.url, userName: args.userName })
      );

      const { error } = await resend.emails.send({
        from: "Flik <noreply@notification.flikapp.xyz>",
        to: [args.to],
        subject: "Verify your Flik email",
        html,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  },
});

export const sendPasswordResetEmail = internalAction({
  args: {
    to: v.string(),
    url: v.string(),
    userName: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (_ctx, args) => {
    try {
      const html = await render(
        ResetPassword({ url: args.url, userName: args.userName })
      );

      const { error } = await resend.emails.send({
        from: "Flik <noreply@notification.flikapp.xyz>",
        to: [args.to],
        subject: "Reset your Flik password",
        html,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  },
});

export const sendOTPEmail = internalAction({
  args: {
    to: v.string(),
    otp: v.string(),
    userName: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (_ctx, args) => {
    try {
      const html = await render(
        OTPEmail({ otp: args.otp, userName: args.userName })
      );

      const { error } = await resend.emails.send({
        from: "Flik <noreply@notification.flikapp.xyz>",
        to: [args.to],
        subject: "Your Flik verification code",
        html,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  },
});
