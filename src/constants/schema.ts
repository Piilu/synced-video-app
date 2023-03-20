import { ConnectedRooms, Room, User, Video } from "@prisma/client";
import { TablerIcon } from "@tabler/icons";
import { LinkTypes } from "./GlobalEnums";


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
    user: User,
}

export type RoomData = (Room & {
    ConnectedRooms: ConnectedRooms[];
    user: User;
    video: Video | null;
}) | null | undefined;


export type LinkItemData = {
    link: string,
    label: string,
    icon: TablerIcon,
    linkType: LinkTypes
}
