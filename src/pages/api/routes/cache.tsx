import { createClient } from 'redis';
import { NextApiResponse, NextApiRequest } from 'next';
import { BoardLog } from '@/global/models';
import { AnyARecord } from 'dns';
import { serverHooks } from 'next/dist/server/app-render/entry-base';

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

        await client.lPush(boardKey, JSON.stringify(boardData))
        const value: any = await client.lRange(boardKey, 0, -1);
        //Push all queue to DB
        if ( value.length > 1) {
            await client.rPop(boardKey);
        }
        const latestQueue = await client.lRange(boardKey, 0, -1);
        let boardLog = await BoardLog.findOneAndUpdate(
            { BoardLogsN: boardKey },
            {
                $push: {
                    history: {
                        $each: latestQueue.map((message: string) => {
                            const parsedObj = JSON.parse(message);
                            return {
                                logs: JSON.stringify(parsedObj.data),
                                time: parsedObj.time
                            };
                        })
                    }
                }
            },
            { new: true, upsert: true }
        );
        await client.disconnect();
        return res.send(value);
    }
    catch (err) {
        return res.send(err)
    }
}