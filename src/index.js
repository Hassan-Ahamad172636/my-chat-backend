// import http from "http";
// import { app } from "./app.js";
// import { databaseConnection } from "./database/server.js";
// import { initSocket } from "./utils/socket.io.js";

// databaseConnection().then(() => {
//   const PORT = process.env.PORT || 3001;

//   const server = http.createServer(app);

//   initSocket(server);

//   server.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// });

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello Hassan, your server is working! 🚀" });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Welcome to Hassan's Backend API");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
