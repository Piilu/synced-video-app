import { Room, User, Video } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export type VideoReq = {
    id?: number,
    name: string,
    isPublic: boolean,
    size: number,
    location: string,
    userId?: string,
    cursor?: number,
    useSearch?: boolean,
}

export type VideoRes = {
    name?: string,
    isPublic?: boolean,
    size?: number,
    location?: string,
    userId?: string,
    errorMessage?: string,
    success: boolean,
    room?: Room[],
    user?: User,
    videos?: Video[],

}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const method = req.method
    const session = await getSession({ req });
    const { name, isPublic, size, location, userId, id, cursor, useSearch } = req.body as VideoReq;
    const response = {} as VideoRes;

    if (!session && method !== "GET")
    {
        response.success = false;
        response.errorMessage = "Unauthorized";
        res.status(401).json(response)
        return;
    }
    try
    {
        //#region Get new x data
        //Later auth issue 
        if (method === "GET")
        {
            const { userId, cursor, useSearch, name } = req.query as unknown as VideoReq;
            //#region Video Search
            if (useSearch)
            {
                const queryData = await prisma?.video.findMany({
                    where: {
                        userId: userId,
                        name: {
                            contains: name,
                        }
                    },
                })

                response.videos = queryData
                response.success = true;
                res.status(200).json(response)
                return;
            }
            //#endregion

            const newData = await prisma?.video.findMany({
                take: 10,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    userId: userId,
                },
            })

            response.videos = newData;
            response.success = true;
            res.status(200).json(response);
            return;
        }
        //#endregion

        //#region  Add Data
        if (method === "POST")
        {

            const video = await prisma?.video.create({
                include: {
                    user: true,
                    room: true,
                },
                data: {
                    name: name,
                    isPublic: isPublic,
                    size: size,
                    location: location,
                    userId: session?.user?.id as string,
                }
            })

            response.name = video?.name;
            response.isPublic = video?.isPublic;
            response.size = video?.size;
            response.location = video?.location;
            response.userId = video?.userId;
            response.room = video?.room
            response.user = video?.user
            response.success = true;
            res.status(200).json(response)
            return;

        }
        //#endregion

        //#region Edit Data
        if (method === "PUT")
        {

            const video = await prisma?.video.update({
                where: {
                    id: id
                },
                include: {
                    user: true,
                    room: true,
                },
                data: {
                    name: name,
                    isPublic: isPublic,
                    size: size,
                    location: location,
                    userId: userId,
                }
            })

            response.name = video?.name;
            response.isPublic = video?.isPublic;
            response.size = video?.size;
            response.location = video?.location;
            response.userId = video?.userId;
            response.room = video?.room
            response.user = video?.user
            response.success = true;
            res.status(200).json(response)
            return;


        }
        //#endregion

        //#region  Delete Data
        if (method === "DELETE")
        {

            const deleteVideo = await prisma?.video.delete({
                where: {
                    id: id
                },
            })

            response.name = deleteVideo?.name;
            response.success = true;
            res.status(200).json(response)
            return;
        }
        //#endregion

    } catch (err: any)
    {
        response.success = false;
        response.errorMessage = err.message;
        console.log(err.message);
        res.status(500).json(response)
        return;
    }

}