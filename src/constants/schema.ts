import { ConnectedRooms, Room, User, Video } from "@prisma/client";


type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX
export type ChatOpen = "flex" | "none";

export type RoomMessage = {
    roomId: number | undefined,
    user: User | undefined,
    message: string,
}

export type VideoAction = {
    time: number,
    roomId: number | undefined,
    type: string,
}

export type RoomData =
(Room & {
    ConnectedRooms: ConnectedRooms[];
    user: User;
    video: Video | null;
}) | null | undefined;



