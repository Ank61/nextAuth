const kafka = require("./client");

async function producers(){
const producer = kafka.producer();
console.log("Connecting Producer");
await producer.connect();

console.log("Producer connected successfull");
await producer.send({
    partition : 0,
    topic : 'riderUpdates',
    messages : [
        {key : 'name' , value : JSON.stringify({name : 'ankit' , location : 'mohali'})}
    ]
})
await producer.disconnect()
}

producers()