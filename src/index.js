import express from "express";
import { userRoute } from "./routes/user.route.js";
import serverless from "serverless-http";

const app = express();

app.use(express.json());

// ✅ Debugging Route
app.get("/", (req, res) => {
  res.status(200).send("✅ Server is up and running!");
});

// ✅ All user-related routes
app.use("/user", userRoute);

// Serverless export for Vercel
export const handler = serverless(app);
export default handler;
