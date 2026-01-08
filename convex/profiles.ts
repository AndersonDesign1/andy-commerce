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

    const now = Date.now();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        userType: args.userType ?? existingProfile.userType,
        storeName: args.storeName ?? existingProfile.storeName,
        offerTypes: args.offerTypes ?? existingProfile.offerTypes,
        onboardingCompleted: true,
        updatedAt: now,
      });
      return existingProfile._id;
    }

    return ctx.db.insert("profiles", {
      userId: user._id,
      userType: args.userType ?? "buyer",
      role: "user",
      storeName: args.storeName,
      offerTypes: args.offerTypes,
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});
