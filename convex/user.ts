import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// export const CreateUser = mutation({
//   args: {
//     name: v.string(),
//     email: v.string(),
//     picture: v.string(),
//     uid: v.string()
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), args.email)).collect();

//     if (user.length == 0) {
//       const result = await ctx.db.insert('users', {
//         name: args.name,
//         email: args.email,
//         pic: args.picture,
//         uid: args.uid
//       });
//       return result;
//     }
//     return user[0]._id
//   }
// })


export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .collect();

    if (user.length === 0) {
      const result = await ctx.db.insert('users', {
        name: args.name,
        email: args.email,
        pic: args.picture,
        uid: args.uid,
        tokens: 20000,
        currentPlan: "FREE"
      });
      return result;
    }
    // If user exists but doesn't have tokens field, patch it
    if (user[0].tokens === undefined) {
      await ctx.db.patch(user[0]._id, { tokens: 0 });
      user[0].tokens = 0;
    }
    if(user[0].currentPlan === undefined){
      await  ctx.db.patch(user[0]._id, { currentPlan: "FREE" });
      user[0].currentPlan = "FREE";
    }
    return user[0];
  }
})


export const GetUser = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();
    return user;
  }
});

export const UpdateTokensForChat = mutation({
  args:{
    email:v.string(),
    tokens:v.number()
  },
  handler:async(ctx, args)=>{
    const user = await ctx.db.query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();

    if (!user) throw new Error("User not found");

    const newTokens = (user.tokens || 0) - args.tokens;
    await ctx.db.patch(user._id, { tokens: newTokens });
    return { ...user, tokens: newTokens };

  }
})
export const UpdateTokens = mutation({
  args: {
    email: v.string(),
    tokens: v.number(),
    planKey: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();

    if (!user) throw new Error("User not found");

    const newTokens = (user.tokens || 0) + args.tokens;
    await ctx.db.patch(user._id, { tokens: newTokens,currentPlan:args.planKey });
    return { ...user, tokens: newTokens,currentPlan:args.planKey };
  },
});