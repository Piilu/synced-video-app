import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { Events } from "../../../constants/events";
import { SendMessage } from "../../../constants/schema";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const roomRouter = createTRPCRouter({
  onJoinRoom: publicProcedure.input(z.object({ roomId: z.string().optional() })).subscription(({ input, ctx }) => {
    return observable<SendMessage>((emit) => {
      //When user joins room (chat message)
      const onJoinRoom = (data: SendMessage) => {
        if (input.roomId === data.roomId) { //Send only in the current room
          data.message = `User (name) joined`
          emit.next(data);
        }
      }

      ctx.ee.on(Events.JOIN_ROOM, onJoinRoom);
      return () => {
        ctx.ee.off(Events.JOIN_ROOM, onJoinRoom)
        //Here I can add logic for leaving room
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
