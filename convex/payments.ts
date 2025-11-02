import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const RecordPayment = mutation({
  args: {
    email: v.string(),
    sessionId: v.string(),
    tokens: v.number(),
    planKey: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("payments", {
      email: args.email,
      sessionId: args.sessionId,
      tokens: args.tokens,
      planKey: args.planKey,
      createdAt: Date.now(),
    });
  },
});

export const GetPaymentBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();
  },
});