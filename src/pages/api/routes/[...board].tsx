const express = require("express");
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { board }: any = req.query
        const operation = board[1];
        switch (operation) {
            case "add":
                await prisma.boards.create({
                    data: {
                        title: req.body?.board?.title,
                        workspace: req.body.board?.workspace,
                        email: req.body.board?.email
                    }
                })
                await prisma.$disconnect()
                return res.send("Board Created")

            case "fetch":
                const result = await prisma.boards.findMany()
                await prisma.$disconnect();
                return res.status(200).json({ result });

            default:
                break;
        }
    }
    catch (error) {
        console.log("Coming Error", error)
        await prisma.$disconnect()
        res.send(error)
        // process.exit(1)
    }

}