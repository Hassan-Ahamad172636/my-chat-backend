import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../controllers/file.js";

const userRoute = Router();

userRoute.post("/create", userController.create);
userRoute.post("/login", userController.login);
userRoute.get("/get-all", authMiddleware, userController.getAll);
userRoute.get("/get-by-id/:id", authMiddleware, userController.getOne);
userRoute.patch(
  "/update/:id",
  upload.single("file"),
  authMiddleware,
  userController.update
);
userRoute.delete("/delete/:id", authMiddleware, userController.delete);

export { userRoute };
