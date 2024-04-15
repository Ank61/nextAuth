import { NextApiRequest, NextApiResponse } from "next";
import { Board } from "@/global/models";
import connectDB from "@/pages/lib/connectDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Coming ", req.body);
        const data = JSON.parse(req.body);
        await connectDB()
        const boardName = data.boardName;
        const memberEmail = data.memberEmail;
        const updatedBoard = await Board.findOneAndUpdate(
            { boardName: boardName },
            { $push: { members: memberEmail } },
            { new: true }
        );
        if (updatedBoard) {
            console.log(`Successfully added ${memberEmail} to board ${boardName}`);
        } else {
            console.log(`Board with name ${boardName} not found`);
        }
        return res.send({ message: 'sucess' });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: 'fail' });
    }
}