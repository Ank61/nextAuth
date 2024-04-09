import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Coming " , req.body)
        const user = await prisma.users.create({
            data: {
                email: req.body.email, 
            }
        })
        await prisma.$disconnect()
        return res.send("Email inserted")
    }
    catch (error) {
        await prisma.$disconnect()
        res.send(error)
        // process.exit(1)
    }
}