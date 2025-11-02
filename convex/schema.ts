import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    pic: v.string(),
    uid: v.string(),
    tokens:v.optional(v.number()), // total tokens user has
    currentPlan: v.optional(v.string())
  }),
  workspaces: defineTable({
    message: v.any(),
    fileData: v.optional(v.any()),
    user: v.id("users")
  }),
  payments: defineTable({
    sessionId: v.string(),
    email: v.string(),
    tokens: v.number(), // tokens purchased in this payment
    createdAt: v.number(),
    planKey: v.optional(v.string())
  })
})
