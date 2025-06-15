import { Router } from "express";
import friendsController from "../controllers/friends.controller.js";
const friendsRoute = Router();

friendsRoute.patch("/addFriend", friendsController.addFriend);

export default friendsRoute;