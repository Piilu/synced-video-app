import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { Session, User, Video } from '@prisma/client';


export type RoomReq =
    {
        id?: number,
        name: string
        isPublic: boolean,
        coverImage?: string | null,
        video?: Video | null
        videoId?: number | null
    }

export type RoomRes =
    {
        success: boolean,
        errorMessage?: string,
        name?: string,
        isPublic?: boolean,
        coverImage?: string | null,
        video?: Video | null
    }

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const method = req.method
    const session = await getSession({ req })
    const { name, isPublic, coverImage, video, id, videoId } = req.body as RoomReq;
    const response = {} as RoomRes;

    if (!session)
    {
        res.status(401).json({ message: "Unauthorized" })
        return;
    }

    //Create new 
    if (method === "POST")
    {
        try
        {
            const room = await prisma?.room.create({
                include: {
                    video: true,
                },
                data: {
                    userId: session.user?.id,
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
        catch (err: any)
        {
            response.success = false;
            response.errorMessage = err.message;
            res.status(500).json(response)
            return;
        }
    }

    //Update existing 
    if (method === "PUT")
    {
        try
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
        catch (err: any)
        {
            response.success = false;
            response.errorMessage = err.message;
            res.status(500).json(response)
            return;
        }
    }

    if (method === "DELETE")
    {
        try
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
        catch (err: any)
        {
            response.success = false;
            response.errorMessage = err.message;
            res.status(500).json(response)
            return;
        }
    }
}