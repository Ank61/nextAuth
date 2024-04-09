const kafka = require("./client");

async function init(){
const consumer = kafka.consumer({groupId : "user-1"});
await consumer.connect();

//Consumer needs to subscribe to a topic
await consumer.subscribe({topics : ["riderUpdates"] , fromBeginning : true});
//From beggining we need message
await consumer.run({
    eachMessage : async({
        topic,partition,message, heartbeat,pause
    })=>{
        //Real world processing the data coming from producer
        console.log(`[${topic}] : PART:${partition} :`,message.value.toString())
    }
});
//Do not disconnect consumer
}
init();