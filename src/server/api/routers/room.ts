import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { Events } from "../../../constants/events";
import { SendMessage } from "../../../constants/schema";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const roomRouter = createTRPCRouter({
    onSendMessage: publicProcedure.input(z.object({ roomId: z.string().optional() })).subscription(({ input, ctx }) => {
      return observable<SendMessage>((emit) => {
        //When user sends message
        const onSendMessage = (data: SendMessage) => {
          if (input.roomId === data.roomId) { 
            emit.next(data);
          }
        }
  
        ctx.ee.on(Events.SEND_MESSAGE, onSendMessage);
        return () => {
          ctx.ee.off(Events.SEND_MESSAGE, onSendMessage)
          //Here I can add logic for leaving room
        }
      })
    }),
    sendMessage: publicProcedure
    .input(
      z.object({
        // user: z.string(),
        message: z.string().optional(),
        roomId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = { ...input };
      ctx.ee.emit(Events.SEND_MESSAGE, post);
      return post;
    }),


})
