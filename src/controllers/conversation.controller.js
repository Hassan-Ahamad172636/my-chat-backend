import { Conversation } from "../models/conversation.model.js";
import { User } from "../models/user.mode.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/generateApiResponse.js";
import mongoose from "mongoose";

export const conversationController = {
  create: asyncHandler(async (req, res) => {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return apiResponse(res, 404, false, "ReceiverId is required!");
    }

    // ✅ Check if receiverId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return apiResponse(res, 400, false, "Invalid receiverId!");
    }

    // ✅ Check if receiver user exists
    const receiverUser = await User.findById(receiverId);

    if (!receiverUser) {
      return apiResponse(res, 404, false, "Receiver user not found!");
    }

    // 🚫 Check if trying to create conversation with yourself
    if (senderId.toString() === receiverId.toString()) {
      return apiResponse(
        res,
        400,
        false,
        "You cannot create conversation with yourself!"
      );
    }

    // 1️⃣ Check if conversation already exists (either way)
    let conversation = await Conversation.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate([
      {
        path: "receiverId",
        select: "fullName profilePhoto",
      },
      {
        path: "senderId",
        select: "fullName profilePhoto",
      },
    ]);

    // 2️⃣ If already exists, return it
    if (conversation) {
      return apiResponse(res, 200, true, "Conversation already exists!", {
        conversation,
      });
    }

    // 3️⃣ If not exists, create new conversation
    conversation = await Conversation.create({ senderId, receiverId });

    // 4️⃣ Populate the newly created conversation
    await conversation.populate([
      {
        path: "receiverId",
        select: "fullName profilePhoto",
      },
      {
        path: "senderId",
        select: "fullName profilePhoto",
      },
    ]);

    // 5️⃣ Return the created conversation
    return apiResponse(res, 201, true, "Conversation created successfully!", {
      conversation,
    });
  }),
};
