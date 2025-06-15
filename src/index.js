import http from "http";
import { app } from "./app.js";
import { databaseConnection } from "./database/server.js";
import { initSocket } from "./utils/socket.io.js";

databaseConnection().then(() => {
  const PORT = process.env.PORT || 3001;

  const server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
