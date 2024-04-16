// import { NextApiRequest, NextApiResponse } from "next";
// import { User } from "../../../global/models/index";
// import connectDB from "@/pages/lib/connectDB";
// import { createClient } from "redis";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         const client = await createClient({
//             password: 'klV4czHFzALORRupNMPqHzcq4ojizh5P',
//             socket: {
//                 host: 'redis-14200.c10.us-east-1-4.ec2.cloud.redislabs.com',
//                 port: 14200
//             }
//         })
//         await client.subscribe('board_changes', function (err, count) {
//             if (err) {
//                 console.log('Error subscribing to channel:', err);
//             } else {
//                 console.log(`Subscribed to ${count} channels`);
//             }
//         });
//         client.on('message', (channel, message) => {
//             if (channel === 'board_changes') {
//                 console.log('Received notification: ', message);
//                 return
//                 // Fetch recent data or take appropriate actions
//             }
//         });
//         return res.send({ message: 'sucess' });
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).send({ message: 'fail' });
//     }
// }