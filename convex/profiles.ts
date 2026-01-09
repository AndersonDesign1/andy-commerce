import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getProfile = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("profiles"),
      _creationTime: v.number(),
      userId: v.string(),
      userType: v.optional(v.string()),
      role: v.optional(v.string()),
      storeName: v.optional(v.string()),
      offerTypes: v.optional(v.array(v.string())),
      onboardingCompleted: v.optional(v.boolean()),
      createdAt: v.float64(),
      updatedAt: v.float64(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }

    return ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();
  },
});

export const getRole = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    return profile?.role ?? "user";
  },
});

export const updateProfile = mutation({
  args: {
    userType: v.optional(v.string()),
    storeName: v.optional(v.string()),
    offerTypes: v.optional(v.array(v.string())),
  },
  returns: v.id("profiles"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    // Check for pending role invite
    const invite = await ctx.db
      .query("role_invites")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .first();

    const assignedRole = invite?.role ?? "user";

    // If invite exists, delete it after use
    if (invite) {
      await ctx.db.delete(invite._id);
    }

    const now = Date.now();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        userType: args.userType ?? existingProfile.userType,
        storeName: args.storeName ?? existingProfile.storeName,
        offerTypes: args.offerTypes ?? existingProfile.offerTypes,
        // Only upgrade role if invite exists, never downgrade
        role:
          invite && assignedRole !== "user"
            ? assignedRole
            : existingProfile.role,
        onboardingCompleted: true,
        updatedAt: now,
      });
      return existingProfile._id;
    }

    return ctx.db.insert("profiles", {
      userId: user._id,
      userType: args.userType ?? "buyer",
      role: assignedRole,
      storeName: args.storeName,
      offerTypes: args.offerTypes,
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Invite a user to become admin or staff
export const inviteToRole = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
  },
  returns: v.id("role_invites"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Check if caller is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    if (profile?.role !== "admin") {
      throw new Error("Only admins can invite users to roles");
    }

    // Check if invite already exists
    const existingInvite = await ctx.db
      .query("role_invites")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingInvite) {
      // Update existing invite
      await ctx.db.patch(existingInvite._id, {
        role: args.role,
        invitedBy: user._id,
        createdAt: Date.now(),
      });
      return existingInvite._id;
    }

    return ctx.db.insert("role_invites", {
      email: args.email,
      role: args.role,
      invitedBy: user._id,
      createdAt: Date.now(),
    });
  },
});

// Revoke a pending role invite
export const revokeInvite = mutation({
  args: {
    email: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Check if caller is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    if (profile?.role !== "admin") {
      throw new Error("Only admins can revoke invites");
    }

    const invite = await ctx.db
      .query("role_invites")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (invite) {
      await ctx.db.delete(invite._id);
      return true;
    }

    return false;
  },
});

// Get all pending invites (admin only)
export const getPendingInvites = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("role_invites"),
      email: v.string(),
      role: v.string(),
      createdAt: v.float64(),
    })
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }

    // Check if caller is admin
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    if (profile?.role !== "admin") {
      return [];
    }

    const invites = await ctx.db.query("role_invites").collect();
    return invites.map((invite) => ({
      _id: invite._id,
      email: invite.email,
      role: invite.role,
      createdAt: invite.createdAt,
    }));
  },
});
