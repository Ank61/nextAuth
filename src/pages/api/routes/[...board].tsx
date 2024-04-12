import { NextApiRequest, NextApiResponse } from "next";
import { Board } from "@/global/models";
import connectDB from "@/pages/lib/connectDB";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { board }: any = req.query;
        const operation = board[1];
        await connectDB()
        switch (operation) {
            case "add":
                // Create a new board document using Mongoose schema
                console.log("GEtting ,,,", req.body.board)
                const newBoard = new Board({
                    boardName: req.body?.board?.title,
                    workspace: req.body?.board?.workspace,
                    members: [req.body?.board?.email],
                    cards: [{
                        cardName: "Stuff to Try (this is a list)",
                        items: [{ title: "Swipe left or right to see other lists on this board." }],
                    }, {
                        cardName: "Try it ( Another Board )",
                        items: [{ title: "Done with this board? Tap Archive board in the board settings menu to close it." }, { title: "Tap and hold a card to pick it up and move it. Try it now!" }, { title: "Create as many cards as you want, we've got an unlimited supply!" }, { title: "Tap this card to open it and see more details." }, { title: "Start using Trello!" }],
                    }],
                    logs : [''],
                })

                // Save the new board document to MongoDB
                await newBoard.save();

                return res.send("Board Created");

            case "fetch":
                // Fetch all board documents from MongoDB
                const boards = await Board.find({});

                return res.status(200).json({ boards });

            default:
                return res.status(400).send("Invalid operation");
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Error processing request");
    }
}
