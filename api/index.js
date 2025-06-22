// api/index.js
import { app } from "../src/app.js";
import { createServer } from "http";
import { databaseConnection } from "../src/database/server.js";
import { parse } from "url";

let server;

export default async function handler(req, res) {
  if (!server) {
    await databaseConnection();
    server = createServer(app);
  }

  const parsedUrl = parse(req.url, true);
  req.url = parsedUrl.path;
  server.emit("request", req, res);
}
