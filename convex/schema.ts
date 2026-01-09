import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(),
    userType: v.optional(v.string()),
    role: v.optional(v.string()),
    storeName: v.optional(v.string()),
    offerTypes: v.optional(v.array(v.string())),
    onboardingCompleted: v.optional(v.boolean()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }).index("by_user_id", ["userId"]),

  // Role invites for admin/staff role assignment
  role_invites: defineTable({
    email: v.string(),
    role: v.string(), // "admin" | "staff"
    invitedBy: v.string(), // userId of the admin who invited
    createdAt: v.float64(),
  }).index("by_email", ["email"]),
});
