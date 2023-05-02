import { Role } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export type UserResBody = {
    success: boolean,
    name: string | null | undefined,
    comment: string | null | undefined,
    image: string | null | undefined,
    usedStorage?: number | null | undefined,
    role?: Role | null,
    errormsg?: string,
}

export type UserReqBody = {
    name: string | null | undefined,
    comment: string | null | undefined,
    image: string | null | undefined,
    userId: string,
    storage?: boolean,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response: UserResBody = {} as UserResBody
    const method = req.method;
    const { name, comment, userId, image } = req.body as UserReqBody;
    const session = await getSession({ req });
    try 
    {
        //#region Validate request
        if (session == null)
        {
            response.errormsg = "Unauthorized"
            response.success = false;
            res.status(401).json(response)
            return;
        }
        //#endregion

        if (method === "GET")
        {
            const { storage } = req.query as unknown as UserReqBody

            if (storage === "true")
            {
                const usedStorage = await prisma?.video.aggregate({
                    where: {
                        userId: session?.user?.id
                    },
                    _sum: {
                        size: true,
                    }
                })
                response.success = true;
                response.usedStorage = usedStorage?._sum.size
                res.status(200).json(response);
                return;
            }
            else
            {
                const user = await prisma?.user.findUnique({
                    where: {
                        id: session?.user?.id
                    },
                });
                response.success = true;
                response.role = user?.role;
                res.status(200).json(response);
                return;
            }
        }

        if (method === "PUT")
        {
            const user = await prisma?.user.update({
                where: {
                    id: userId,
                },
                data: {
                    name: name,
                    bio: comment,
                    image: image,
                }
            })
            response.name = user?.name;
            response.comment = user?.bio;
            response.success = true;
            res.status(200).json(response)
            return;
        }
    }
    catch (err: any)
    {
        console.log(err)
        response.success = false;
        response.errormsg = err.message;
        res.status(500).json(response)
    }

    res.status(405).json({ message: "Method not allowed" });
}