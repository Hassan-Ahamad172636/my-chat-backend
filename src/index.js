import express from "express";
import { userRoute } from "./routes/user.route.js";
import serverless from "serverless-http";

const app = express();

app.use(express.json());
app.use("/user", userRoute); // 🔗 now routes like /user/create, /user/login etc.

export const handler = serverless(app); // For Vercel
export default handler;
