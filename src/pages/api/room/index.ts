import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { Room, Session, User, Video } from '@prisma/client';


export type RoomReq = {
    id?: number,
    name: string
    isPublic: boolean,
    coverImage?: string | null,
    video?: Video | null
    videoId?: number | null,
    userId?: string,
    cursor?: number,
    useSearch?: boolean,
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
    //#region Authorize
    if (!session && method != "GET")
    {
        res.status(401).json({ message: "Unauthorized" })
        return;
    }
    //#endregion

    try
    {
        //#region Get new x data
        //Later auth issue 
        if (method === "GET")
        {
            const { userId, cursor, useSearch, name } = req.query as unknown as RoomReq;
            const limit = 10;
            //#region Room search
            if (useSearch)
            {
                const queryData = await prisma?.room.findMany({
                    include: {
                        ConnectedRooms: true,
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
            console.log("SEEEEEEAAAAARCH =>>>>"+name)
            const nextData = await prisma?.room.findMany({
                where: {
                    userId: userId,
                    isPublic: session?.user?.id == userId ? {} : true,
                    name: {
                        contains: name,
                    }
                },
                include: {
                    ConnectedRooms: true,
                    user: true,
                },
                take: limit,
                skip: 1,
                cursor: {
                    id: parseInt(cursor as unknown as string),
                }
            })
            response.success = true;
            response.rooms = nextData;
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

            console.log("______________________________________");
            console.log(name);
            console.log(isPublic);
            console.log(coverImage);
            console.log(videoId);
            const room = await prisma?.room.update({
                include: {
                    video: true,
                },
                where: {
                    id: id,
                },

                data: {
                    name: name,
                    isPublic: isPublic,
                    coverImage: coverImage,
                    videoId: video?.id ?? videoId,
                }
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
}