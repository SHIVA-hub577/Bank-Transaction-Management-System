const mongoose=require("mongoose");
const dns = require("dns");

// Fix Node.js DNS SRV lookup issues on Windows networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

function ConnectToDb(){
    mongoose.connect(process.env.MONGO_DB_URL)
    .then(()=>{
        console.log("server is connected")
    })
    .catch((err)=>{
        console.log('Error in connection to database:', err);
        process.exit(1);
    })
}

module.exports = ConnectToDb;