import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
type Data = {
    id: string,
}

export type UserResBody = {
    success: boolean,
    name: string,
    comment: string,
    errormsg?: string,
}

export type UserReqBody = {
    name: string,
    comment: string,
    userId: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    let response: UserResBody = {} as UserResBody

    const method = req.method;
    const { name, comment, userId } = req.body as UserReqBody;
    const session = await getSession({ req });
    //hopefully try/catch gets prisma errors as well :)
    try 
    {
        if (method == "PUT")
        {
            let result = await prisma?.user.updateMany({
                where: {
                    id: userId,
                },
                data: {
                    name: name,
                    bio: comment,
                }
            })
            response.name = name;
            response.comment = comment;
            response.success = true;
            res.status(200).json(response)
            return;
        }
    }
    catch (err)
    {
        console.log(err)
        response.success = false;
        response.errormsg = err.message;
        res.status(500).json(response)
    }
}