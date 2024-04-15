import { NextApiRequest, NextApiResponse } from "next";
import { BoardLog } from "@/global/models";
import connectDB from "@/pages/lib/connectDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Coming ", req.body);
        const boardId = JSON.parse(req.body);
        const id = boardId.boardId
        console.log(id)
        await connectDB()
        const logs = await BoardLog.find({ BoardLogsN: id })
        return res.send(logs);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: 'fail' });
    }
}