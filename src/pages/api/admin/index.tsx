import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";

export type UsersReqBody = {
    userId: string,
    maxGb: number,
}

export type UsersResBody = {
    success: boolean,
    maxGb: number,
    error?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const { userId, maxGb } = req.body as UsersReqBody
    const response = {} as UsersResBody
    const method = req.method;
    const session = await getSession({ req });
    const multiple = 1000000000;
    try
    {

        if (method == "GET" && session)
        {
            const user = await prisma?.user.findFirst({
                where: {
                    id: session?.user?.id
                }
            })

            response.success = true;
            response.maxGb = user?.storage * multiple;
            res.status(200).json(response);
            return;
        }

        if (method == "PUT" && session?.user?.role == "SUPERADMIN")
        {
            const user = await prisma?.user.update({
                where: {
                    id: userId
                },
                data: {
                    storage: maxGb
                }
            });

            response.success = true;
            response.maxGb = user?.storage * multiple;
            res.status(200).json(response);
            return;
        }

        response.success = false;
        response.error = "Method not allowed";
        res.status(405).json(response);
        return;
    }

    catch (e)
    {
        response.success = false;
        response.error = e.message;
        res.status(500).json(response);
        return;
    }
}