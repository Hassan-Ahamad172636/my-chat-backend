// import express from "express";
// import { userRoute } from "../src/routes/user.route.js"; // ✅ apna existing route import karo
// import serverless from "serverless-http";

// const app = express();
// app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("pong");
});

// // Use your routes
// app.use("/user", userRoute);

// // Export as serverless handler
// export default serverless(app);
