import { Room, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export type VideoReq = {
    id?: number,
    name: string,
    isPublic: boolean,
    size: number,
    location: string,
    userId: string,
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

}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const method = req.method
    const session = await getSession({ req });
    const { name, isPublic, size, location, userId, id } = req.body as VideoReq;
    const response = {} as VideoRes;

    if (!session)
    {
        response.success = false;
        response.errorMessage = "Unauthorized";
        res.status(401).json(response)
        return;
    }

    if (method === "POST")
    {
        try
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
                    userId: userId as string,
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
        catch (err: any)
        {
            response.success = false;
            response.errorMessage = err.message;
            console.log(err.message);
            res.status(200).json(response)
            return;
        }

    }

    if (method === "PUT")
    {
        try
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
        catch (err: any)
        {
            response.success = false;
            response.errorMessage = err.message;
            res.status(200).json(response)
            return;
        }

    }

    if (method === "DELETE")
    {
        try
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
        catch (err: any)
        {
            response.success = false;
            response.errorMessage = err.message;
            res.status(200).json(response)
            return;
        }

    }

    response.success = false;
    response.errorMessage = "Not allowed"
    res.status(405).json(response)
    return;
}