import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteAccount = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // 1️⃣ Find the user by email
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (!user) throw new Error("User not found");

    // 2️⃣ Delete all workspaces linked to the user
    const workspaces = await ctx.db
      .query("workspaces")
      .filter(q => q.eq(q.field("user"), user._id))
      .collect();

    for (const ws of workspaces) {
      await ctx.db.delete(ws._id);
    }

    // 3️⃣ Delete all payments linked to the user's email
    const payments = await ctx.db
      .query("payments")
      .filter(q => q.eq(q.field("email"), args.email))
      .collect();

    for (const pay of payments) {
      await ctx.db.delete(pay._id);
    }

    // 4️⃣ Delete the user
    await ctx.db.delete(user._id);

    return { success: true, message: "Account and related data deleted." };
  },
});
