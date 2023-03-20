//yt: TomDoesTech
import { NextApiRequest, NextApiResponse } from "next";
import busboy from "busboy";
import fs from 'fs'
import { getSession } from "next-auth/react";

export const config = {
    api: {
        bodyParser: false,
    }
}

async function uploadVideoStream(req: NextApiRequest, res: NextApiResponse)
{
    const session = await getSession({ req })
    if (session === null)
    {
        res.status(401).json({ message: "Unauthorized" })
        return;
    }

    const bb = busboy({ headers: req.headers })
    var dir = `./videos/${session?.user?.id}`;

    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }

    bb.on('file', (_, file, info) =>
    {
        const fileName = info.filename;
        const filePath = `./videos/${session?.user?.id}/${fileName}` //make custom filenames
        const stream = fs.createWriteStream(filePath);
        file.pipe(stream);
    })

    bb.on('close', () =>
    {
        res.writeHead(200, { Connection: "close" })
        res.end('Upload end')
    })

    req.pipe(bb)
    return;
}


const CHUNK_SIZE_IN_BYTES = 1000000//1mb;

function getVideoStream(req: NextApiRequest, res: NextApiResponse)
{
    const range = req.headers.range;

    if (!range)
    {
        return res.status(400).send("No range");
    }

    const videoId = req.query.videoId
    const videoPath = `./videos/${videoId}.mp4`

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
}