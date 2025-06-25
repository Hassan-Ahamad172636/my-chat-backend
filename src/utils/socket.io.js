// services/socketService.js
import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // ✅ userId => socket.id

export const initSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // ✅ User joins with ID
    socket.on("userConnected", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`🟢 User connected: ${userId}`);

      io.emit("onlineUsers", Array.from(onlineUsers.keys())); // Notify all
    });

    // ✅ Join Room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`🔵 User joined room: ${roomId}`);
    });

    // ✅ Send Message
    socket.on("sendMessage", ({ roomId, message, sender }) => {
      console.log(`📨 Message in ${roomId} from ${sender}: ${message}`);

      // ✅ Add defensive logging here:
      console.log("👉 Payload received on backend:", {
        roomId,
        message,
        sender,
      });

      // Then emit:
      io.to(roomId).emit("receiveMessage", {
        message,
        sender,
        time: new Date().toISOString(),
        conversationId: roomId,
      });
    });

    // ✅ Disconnect Handler
    socket.on("disconnect", () => {
      const userId = [...onlineUsers.entries()].find(
        ([_, sid]) => sid === socket.id
      )?.[0];
      if (userId) {
        onlineUsers.delete(userId);
        console.log(`🔴 User disconnected: ${userId}`);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      } else {
        console.log("❌ Unknown socket disconnected:", socket.id);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.io not initialized!");
  }
  return io;
};
