require("dotenv").config();
const app = require("./src/app");
const ConnectToDb = require("./src/config/db");

/**
 * ============================================================================
 * SERVER ENTRY POINT
 * ============================================================================
 * Loads environment variables, connects to the MongoDB database,
 * and starts the HTTP server listener.
 */

const port = process.env.PORT || 3005;

// Establish MongoDB Connection
ConnectToDb();

// Start HTTP Listener
app.listen(port, () => {
    console.log(`Server started successfully at http://localhost:${port}`);
});