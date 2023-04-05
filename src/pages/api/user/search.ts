import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { UserSmall } from "../../../constants/schema";

export type SearchResBody = {
    users: UserSmall[] | undefined
    errormsg?: string,
    success: boolean,
}

export type SearchReqBody = {
    getName: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    let response: SearchResBody = {} as SearchResBody
    const session = await getSession({ req });
    const { getName } = req.query as unknown as SearchReqBody;
    const mehtod = req.method;

    //#region Validate request
    if (session == null)
    {
        response.errormsg = "Unauthorized"
        response.success = false;
        res.status(401).json(response)
        return;
    }

    if (mehtod !== "GET")
    {
        response.errormsg = `Method ${mehtod} is not allowed`
        response.success = false;
        res.status(405).json(response)
        return;
    }
    //#endregion

    try
    {
        const result = await prisma?.user.findMany({
            where: {
                name: {
                    contains: getName
                },
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
    catch (err: any)
    {
        response.success = false;
        response.errormsg = err.message;
        res.status(500).json(response);
        return;
    }

}