//yt: TomDoesTech
import { NextApiRequest, NextApiResponse } from "next";
import busboy from "busboy";
import fs from 'fs'
import { getSession } from "next-auth/react";
import formidable, { File } from 'formidable';
import { Helpers } from "../../../constants/GlobalEnums";
import { randomUUID } from "crypto";

export const config = {
    api: {
        bodyParser: false,
    }
}
export type UploadVideoRes = {
    fileName?: string,
    success: boolean,
    error?: string,
}
async function uploadVideoStream(req: NextApiRequest, res: NextApiResponse) //use import formidable from "formidable";
{
    let response = {} as UploadVideoRes;
    const session = await getSession({ req })
    try
    {
        if (session === null)
        {
            res.status(401).json({ message: "Unauthorized" })
            return;
        }

        const bb = busboy({ headers: req.headers })
        var dir = `./videos/${session?.user?.id}`;
        let uploadedFilename: string;


        if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }

        bb.on('file', (_, file, info) =>
        {
            const fileName = randomUUID() + ".mp4"
            uploadedFilename = fileName;
            const filePath = `./videos/${session?.user?.id}/${fileName}` //make custom filenames
            const stream = fs.createWriteStream(filePath);
            file.pipe(stream);
        })

        bb.on('close', () =>
        {
            response.fileName = uploadedFilename;
            response.success = true;
            res.status(200).json(response);
        })
        req.pipe(bb)

        return;
    }
    catch (err: any)
    {
        response.success = false;
        response.error = err.message;
        res.status(200).json(response);
        return;
    }
}



const CHUNK_SIZE_IN_BYTES = 1000000//1mb;

async function getVideoStream(req: NextApiRequest, res: NextApiResponse)
{
    const range = req.headers.range;
    // const session = await getSession({ req })

    if (!range)
    {
        return res.status(400).send("No range");
    }

    const { videoId, ownerId } = req.query
    console.log("VIDEOLOG: ", videoId, ownerId)
    const videoPath = `${Helpers.VideoStartPath}/${ownerId}/${videoId}`

    const videoSizeInBytes = fs.statSync(videoPath).size;

    const chunkStart = Number(range.replace(/\D/g, ""))
    const chunkEnd = Math.min(
        chunkStart + CHUNK_SIZE_IN_BYTES,
        videoSizeInBytes - 1
    );

    const contentLength = chunkEnd - chunkStart + 1;

    const headers = {
        'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    }
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, {
        start: chunkStart,
        end: chunkEnd,
    })
    videoStream.pipe(res);
}
export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const method = req.method;

    if (method === "GET")
    {
        return getVideoStream(req, res);
    }
    if (method === "POST")
    {
        return uploadVideoStream(req, res);
    }

    res.status(405).json({ message: "Method not allowed" });
}