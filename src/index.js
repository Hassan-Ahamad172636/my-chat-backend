import http from "http";
import { app } from "./app.js";
import { databaseConnection } from "./database/server.js";
import { initSocket } from "./utils/socket.io.js";

databaseConnection()
  .then(() => {
    const PORT = process.env.PORT || 5001;

    const server = http.createServer(app);

    const io = initSocket(server);

    server.listen(PORT, () => {
      console.log(
        `\n==================================\n server is running at port: ${PORT}! \n==================================\n`
      );
    });
  })
  .catch((err) => {
    console.log(
      "\n==================================\n server not start! \n==================================\n"
    );
    console.error(err);
  });
