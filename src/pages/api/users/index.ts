import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export type UsersReqBody = {
    count: number,
}

export type UsersResBody = {
    success: boolean,
    errormsg?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response: UsersResBody = {} as UsersResBody
    const session = await getSession({ req });
    const { count } = req.query as unknown as UsersReqBody;
    const mehtod = req.method;

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

        if (mehtod === "GET")
        {
            const result = await prisma?.user.findMany({
                orderBy: {
                    name: "asc",
                },
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
                take: 10,
            })

            response.success = true;
            response.users = result;
            res.status(200).json(response);
            return;
        }

    }
    catch (err: any)
    {
        response.success = false;
        response.errormsg = err.message;
        res.status(500).json(response);
        return;
    }


    response.errormsg = `Method ${mehtod} is not allowed`
    response.success = false;
    res.status(405).json(response)
}