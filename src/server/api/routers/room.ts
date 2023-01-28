import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { Events } from "../../../constants/events";
import { SendMessage } from "../../../constants/schema";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const roomRouter = createTRPCRouter({
  //T3 example 
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
})
