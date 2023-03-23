import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
type Data = {
    id: string,
}

export type UserResBody = {
    success: boolean,
    name: string | null | undefined,
    comment: string | null | undefined,
    image: string | null | undefined,
    usedStorage?: number | null | undefined,
    errormsg?: string,
}

export type UserReqBody = {
    name: string | null | undefined,
    comment: string | null | undefined,
    image: string | null | undefined,
    userId: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    let response: UserResBody = {} as UserResBody

    const method = req.method;
    const { name, comment, userId, image } = req.body as UserReqBody;
    const session = await getSession({ req });
    //#region Authorize
    // if (session?.user?.id != userId)
    // {
    //     //Idk if it has to be here 
    //     response.errormsg = "Not allowed"
    //     response.success = false;
    //     res.status(400).json(response);
    //     return;
    // }
    //need to chage some prisma actions
    if (session == null)
    {
        response.errormsg = "Unauthorized"
        response.success = false;
        res.status(401).json(response)
        return;
    }
    if (method === "GET")
    {
        try
        {

            const usedStorage = await prisma?.video.aggregate({
                where: {
                    userId: session.user.id
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
        catch (err: any)
        {
            response.success = false
            response.errormsg = err.message;
            res.status(500).json(response);
            return;
        }
    }
    //#endregion
    try 
    {
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
}