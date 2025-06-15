// services/socketService.js
import { Server } from "socket.io";

let io;

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

    // Join Room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`🔵 User joined room: ${roomId}`);
    });

    // Receive Message
    socket.on("sendMessage", ({ roomId, message, sender }) => {
      console.log(`📨 Message received in room ${roomId} from ${sender}: ${message}`);

      // Emit to same room
      io.to(roomId).emit("receiveMessage", {
        message,
        sender,
        time: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
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
