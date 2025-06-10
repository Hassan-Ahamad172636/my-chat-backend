import { app } from "./app.js";
import { databaseConnection } from "./database/server.js";
import { initSocket } from "./utils/socket.io.js";

await databaseConnection();

// ye section hata diya (no server.listen)
// app.js ke andar ye add kar do:

app.get("/", (req, res) => {
  res.json({
    message: "Server is live! 🚀",
    status: "success"
  });
});


export default app;
