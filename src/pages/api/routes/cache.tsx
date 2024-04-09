import { createClient } from 'redis';
import { NextApiResponse, NextApiRequest } from 'next';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const redisHost = 'redis-14200.c10.us-east-1-4.ec2.cloud.redislabs.com:14200';
    const redisPort = 6379;
     const redisPassword = 'klV4czHFzALORRupNMPqHzcq4ojizh5P';


    const client = await createClient({
        password  : redisPassword,
        socket: {
            host: 'redis-14200.c10.us-east-1-4.ec2.cloud.redislabs.com',
            port: 14200
        }
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    await client.set('key', req.body.redisData);
    const value = await client.get('key');
    await client.disconnect();
    return res.send(value);

}