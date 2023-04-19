import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { Room, Session, User, Video } from '@prisma/client';


export type RoomReq = {
    id?: string,
    name: string
    isPublic: boolean,
    coverImage?: string | null,
    video?: Video | null
    videoId?: number | null,
    userId?: string,
    cursor?: number,
    useSearch?: boolean,
}

export type RoomUpdateReq = {
    updateRoomId: string,
    updateVideoId: number,
}

export type RoomRes = {
    success: boolean,
    errorMessage?: string,
    name?: string,
    isPublic?: boolean,
    coverImage?: string | null,
    video?: Video | null
    rooms?: Room[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const method = req.method
    const session = await getSession({ req })
    const { name, isPublic, coverImage, video, id, videoId, userId, cursor, useSearch } = req.body as RoomReq;
    const response = {} as RoomRes;

    //#region Validate request
    if (!session && method != "GET")
    {
        res.status(401).json({ message: "Unauthorized" })
        return;
    }
    //#endregion

    try
    {
        //#region Room search
        if (method === "GET")
        {
            const { userId, cursor, useSearch, name } = req.query as unknown as RoomReq;
            const limit = 10;
            const queryData = await prisma?.room.findMany({
                include: {
                    ConnectedRooms: {
                        include: {
                            user: true,
                        }
                    },
                    user: true,
                },
                where: {
                    userId: userId,
                    name: {
                        contains: name,
                    },
                    isPublic: session?.user?.id == userId ? {} : true,
                },
                take: limit,
            })

            response.rooms = queryData;
            response.success = true;
            res.status(200).json(response)
            return;
        }
        //#endregion

        //#region Create new 
        if (method === "POST")
        {

            const room = await prisma?.room.create({
                include: {
                    video: true,
                },
                data: {
                    userId: session?.user?.id as string,
                    coverImage: coverImage,
                    name: name,
                    isPublic: isPublic,
                    videoId: videoId,
                },
            })

            response.success = true;
            response.name = room?.name;
            response.coverImage = room?.coverImage;
            response.isPublic = room?.isPublic;
            response.video = room?.video;
            res.status(200).json(response);
            return;

        }
        //#endregion

        //#region Update existing 
        if (method === "PUT")
        {
            const { updateRoomId, updateVideoId } = req.body as RoomUpdateReq;
            const room = await prisma?.room.findFirst({
                include: {
                    user: true,
                },
                where: {
                    id: updateRoomId,
                },
            })
            
            if (room?.userId !== session?.user?.id)
            {
                response.success = false;
                response.errorMessage = "Not allowed";
                res.status(403).json(response);
                return;
            }

            const updatedRoom = await prisma?.room.update({
                include: {
                    video: true,
                },
                where: {
                    id: updateRoomId,
                },

                data: {
                    // name: updateRoom.name,
                    // isPublic: updateRoom.isPublic,
                    // coverImage: updateRoom.coverImage,
                    videoId: updateVideoId,
                }
            })
            response.success = true;
            response.name = updatedRoom?.name;
            response.coverImage = updatedRoom?.coverImage;
            response.isPublic = updatedRoom?.isPublic;
            response.video = updatedRoom?.video;
            res.status(200).json(response);
            return;
        }
        //#endregion

        //#region Delete 
        if (method === "DELETE")
        {

            const deleteRoom = await prisma?.room.delete({
                where: {
                    id: id,
                },
            })

            response.success = true;
            response.name = deleteRoom?.name;
            res.status(200).json(response);
            return;


        }
        //#endregion
    }
    catch (err: any)
    {
        response.success = false;
        response.errorMessage = err.message;
        res.status(500).json(response)
        return;
    }

    res.status(405).json({ message: "Method not allowed" });
}