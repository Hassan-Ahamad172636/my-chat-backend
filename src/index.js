// src/index.js
import { app } from "./app.js";
import { databaseConnection } from "./database/server.js";
import { createServer } from "http";
import { initSocket } from "./utils/socket.io.js";

const PORT = process.env.PORT || 3001;

// Step 1: Create HTTP server
const server = createServer(app);

// Step 2: Initialize socket.io on that server
initSocket(server);

// Step 3: Connect to DB and start listening
databaseConnection()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Network error!", error.message);
  });
