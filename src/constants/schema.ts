import { TablerIcon } from "@tabler/icons";
import z from "zod"; //really don't need use this
import { LinkTypes } from "./GlobalEnums";

const sendMessageSchema = z.object({
    roomId: z.string(),
    message: z.string(),
});

const sendMessageSchemaTest = z.object({
    roomId: z.string(),
    user: z.string(),
    message: z.string(),
});

const videoAction = z.object({
    time: z.number(),
    roomId: z.string(),
    type: z.string(),
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
export type VideoAction = z.TypeOf<typeof videoAction>;
export type LinkItemData = {
    link: string,
    label: string,
    icon: TablerIcon,
    linkType: LinkTypes,
}
//#region Types 
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX
export type ChatOpen = "flex" | "none";
//#endregion

export const messageSubSchema = z.object({
    roomId: z.string(),
});