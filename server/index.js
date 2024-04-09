
const kafka = require("./client");

async function init() {
    //Step 1 : Create Admin
    const admin = kafka.admin();
    admin.connect()
    console.log("Admin connection success");

    //Step 2 : Create Topics
    console.log("Creating Topic [Rider-updates]")
    await admin.createTopics({
        topics: [{
            topic: "riderUpdates",
            numPartitions: 2,
        }]
    })
    console.log("Topic created");
    console.log("Disconnecting Admin...");
    admin.disconnect();
}

init();