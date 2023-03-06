import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.body.method

    if (method !== "POST") {
        res.status(405).json({ message: "Not allowed" })
        return;
    }


    
}