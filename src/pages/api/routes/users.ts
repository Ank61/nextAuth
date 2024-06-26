import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../global/models/index";
import connectDB from "@/pages/lib/connectDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Coming ", req.body);
        await connectDB()
        const newUser = new User({
            email: req.body.email
        });
        const savedUser = await newUser.save();

        console.log("Response", savedUser);

        return res.send("Email inserted");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Error inserting email");
    }
}