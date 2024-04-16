import { createClient } from 'redis';
import { NextApiResponse, NextApiRequest } from 'next';
import { BoardLog } from '@/global/models';
import { Board } from '@/global/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const redisHost = 'redis-14200.c10.us-east-1-4.ec2.cloud.redislabs.com:14200';
    const redisPort = 6379;
    const redisPassword = 'klV4czHFzALORRupNMPqHzcq4ojizh5P';

    try {
        const parsed = JSON.parse(req.body);
        const boardKey = parsed.boardKey;
        const boardData = parsed.boardData;
        const client = await createClient({
            password: redisPassword,
            socket: {
                host: 'redis-14200.c10.us-east-1-4.ec2.cloud.redislabs.com',
                port: 14200
            }
        })
            .on('error', err => console.log('Redis Client Error', err))
            .connect();
        // await client.publish('board_changes', 'Changes have been made');
        await client.lPush(boardKey, JSON.stringify(boardData))
        const value: any = await client.lRange(boardKey, 0, -1);
        //Push all queue to DB
        if (value.length > 1) {
            await client.rPop(boardKey);
        }
        const latestQueue = await client.lRange(boardKey, 0, -1);
        try {
            let boardLog = await BoardLog.findOneAndUpdate(
                { BoardLogsN: boardKey },
                {
                    $push: {
                        history: {
                            $each: latestQueue.map((message: string) => {
                                const parsedObj = JSON.parse(message);
                                return {
                                    logs: parsedObj.data,
                                    time: parsedObj.time,
                                    changedData: JSON.stringify(parsedObj.changedData)
                                };
                            })
                        }
                    }
                },
                { new: true, upsert: true }
            );
        } catch (error) {
            console.error("Error updating board log:", error);
            // Handle error (e.g., send an error response)
        }
        const currentSnapshot: any = await client.lRange(boardKey, 0, -1);
        let board = await Board.findById(boardKey);
        const Indexed = currentSnapshot[0];
        const parsedObj = JSON.parse(Indexed);
        board.cards = parsedObj.data;
        const updatedBoard = await board.save();

        // client.on('message', (channel, message) => {
        //     if (channel === 'board_changes') {
        //         console.log('Received notification: ', message);
        //         // Fetch recent data or take appropriate actions
        //     }
        // });

        // await client.subscribe('board_changes', function (err, count) {
        //     if (err) {
        //         console.log('Error subscribing to channel:', err);
        //     } else {
        //         console.log(`Subscribed to ${count} channels`);
        //     }
        // });
        // await client.disconnect();
        return res.send(updatedBoard);
    }
    catch (err) {
        return res.send(err)
    }
}