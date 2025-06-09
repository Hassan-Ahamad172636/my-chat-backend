import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const chatRouter = Router();
chatRouter.post("/send",authMiddleware, chatController.create);
chatRouter.post("/get",authMiddleware, chatController.getMessages);
export { chatRouter };
