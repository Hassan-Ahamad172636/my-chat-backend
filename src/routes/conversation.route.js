import { Router } from "express";
import { conversationController } from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const conversationRouter = Router();

conversationRouter.post('/create',authMiddleware ,conversationController.create);

export { conversationRouter };
