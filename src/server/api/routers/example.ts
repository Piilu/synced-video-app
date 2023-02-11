import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getByName: publicProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findFirst({
        where: {
          name: input,
        }
      });

    }),

  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});
