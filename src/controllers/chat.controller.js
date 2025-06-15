import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/generateApiResponse.js";
import { getIO } from "../utils/socket.io.js";

export const chatController = {
  create: asyncHandler(async (req, res) => {
    console.log("Check 1");
    
    const { conversationId, message } = req.body;

    console.log("Check 2");
    const senderId = req?.user?.id;

    if (!conversationId || !message) {
      return apiResponse(
        res,
        400,
        false,
        "Conversation id and message are required!"
      );
    }

    const chat = await Chat.create({
      conversationId,
      senderId,
      message,
    });

    if (!chat) {
      return apiResponse(res, 400, false, "All fields are required!");
    }

    // ✅ Emit real-time message to all users in the room
    const io = getIO();
    io.to(conversationId).emit("message", chat);

    // ✅ Console log the emitted message
    console.log("📤 Emitted message to room:", conversationId);
    console.log("📝 Message data:", chat);

    return apiResponse(res, 201, true, "Message sent successfully!", { chat });
  }),

  getMessages: asyncHandler(async (req, res) => {
    const { conversationId } = req.body;

    if (!conversationId) {
      return apiResponse(res, 400, false, "Conversation id is required!");
    }

    const messages = await Chat.find({ conversationId }).sort({ createdAt: 1 });

    if (!messages) {
      return apiResponse(
        res,
        404,
        false,
        "No messages found for this conversation."
      );
    }

    return apiResponse(res, 200, true, "Messages fetched successfully!", {
      messages,
    });
  }),
};
