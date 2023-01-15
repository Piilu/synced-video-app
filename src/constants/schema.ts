import z from "zod";

const sendMessageSchema = z.object({
    roomId: z.string(),
    message: z.string(),
});

const messageSchema = z.object({
    id: z.string(),
    message: z.string(),
    roomId: z.string(),
    sentAt: z.date(),
    sender: z.object({
        name: z.string(),
    }),
});

export type Message = z.TypeOf<typeof messageSchema>;
export type SendMessage = z.TypeOf<typeof sendMessageSchema>;


export const messageSubSchema = z.object({
    roomId: z.string(),
});