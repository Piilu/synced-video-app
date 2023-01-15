import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { Events } from "../../../constants/events";
import { SendMessage } from "../../../constants/schema";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const roomRouter = createTRPCRouter({
  onJoinRoom: publicProcedure.input(z.object({ roomId: z.string().optional() })).subscription(({ input, ctx }) => {
    console.log("Testing:" + ctx)
    console.log(input)
    return observable<SendMessage>((emit) => {
      const onAdd = (data: SendMessage) => {
        if (input.roomId === data.roomId) {
          emit.next(data);
        }
      }

      ctx.ee.on(Events.JOIN_ROOM, onAdd);
      return () => {
        ctx.ee.off(Events.JOIN_ROOM, onAdd)
      }
    })
  }),
  joinRoom: publicProcedure
    .input(
      z.object({
        message: z.string(),
        roomId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = { ...input };
      ctx.ee.emit(Events.JOIN_ROOM, post);
      return post;
    }),

})
