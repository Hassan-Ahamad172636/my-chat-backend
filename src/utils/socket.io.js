// services/socketService.js
import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // 🔁 userId -> socket.id

export const initSocket = (server) => {
  if (io) return io; // Already initialized

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // 🔌 User connected event
    socket.on("user-connected", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`🟢 User ${userId} is online`);

      // Notify all clients about current online users
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    // 🔁 Join Room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`🔵 User joined room: ${roomId}`);
    });

    // ✉️ Receive and emit message
    socket.on("sendMessage", ({ roomId, message, sender }) => {
      console.log(`📨 Message received in room ${roomId} from ${sender}: ${message}`);

      io.to(roomId).emit("receiveMessage", {
        message,
        sender,
        time: new Date().toISOString(),
      });
    });

    // 🔌 User disconnected
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`🔴 User ${userId} is offline`);
          break;
        }
      }

      // Notify all clients again
      io.emit("online-users", Array.from(onlineUsers.keys()));

      console.log("❌ Client disconnected:", socket.id);
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
