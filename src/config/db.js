const mongoose = require("mongoose");
const dns = require("dns");

/**
 * ============================================================================
 * DATABASE CONFIGURATION MODULE
 * ============================================================================
 * Handles connection establishing to MongoDB using Mongoose ODM.
 * Configures explicit DNS resolvers (Google DNS 8.8.8.8, 8.8.4.4) to prevent
 * Windows network DNS SRV lookup failures on `mongodb+srv://` connection strings.
 */

// Override default Node.js DNS servers to fix SRV lookup issues on Windows
dns.setServers(["8.8.8.8", "8.8.4.4"]);

/**
 * Connect to MongoDB database
 */
function ConnectToDb() {
    mongoose.connect(process.env.MONGO_DB_URL)
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((err) => {
            console.error("Error connecting to database:", err);
            process.exit(1);
        });
}

module.exports = ConnectToDb;