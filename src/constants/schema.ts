import z from "zod";

const sendMessageSchema = z.object({
    roomId: z.string(),
    message: z.string(),
});

const sendMessageSchemaTest = z.object({
    user: z.string(),
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
export type SendMessageTest = z.TypeOf<typeof sendMessageSchemaTest>;


export const messageSubSchema = z.object({
    roomId: z.string(),
});