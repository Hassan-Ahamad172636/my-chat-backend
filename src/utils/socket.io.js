import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (io) {
    return io; // already initialized
  }

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    // Join a conversation room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} joined room: ${roomId}`);
    });

    // Leave a conversation room
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`📤 Socket ${socket.id} left room: ${roomId}`);
    });

    // Receive message and send it to the room
    socket.on("message", (data) => {
      console.log("📨 Message received from client:", data);

      // Emit message to all clients in the room (including sender)
      io.to(data.conversationId).emit("message", data);

      console.log(`📤 Message broadcasted to room ${data.conversationId}:`, data);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
