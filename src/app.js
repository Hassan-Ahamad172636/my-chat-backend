import express from "express";
import cors from "cors";
import { userRoute } from "./routes/user.route.js";
import { conversationRouter } from "./routes/conversation.route.js";
import { chatRouter } from "./routes/chat.route.js";
import friendsRoute from "./routes/friend.route.js";

const app = express();

app.use(
  cors({
    origin: "https://admin-my-chat-com.vercel.app", // ✅ Tumhara deployed frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("🎉 Serverless Express is working!");
});

app.use("/user", userRoute);
app.use("/conversation", conversationRouter);
app.use("/chat", chatRouter);
app.use("/friends", friendsRoute);

export { app };
