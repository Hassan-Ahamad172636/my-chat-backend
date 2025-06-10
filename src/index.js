import { app } from "./app.js";
import { databaseConnection } from "./database/server.js";
import { initSocket } from "./utils/socket.io.js";

await databaseConnection();

// ye section hata diya (no server.listen)

export default app;
