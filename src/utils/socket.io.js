let io;
const onlineUsers = new Map(); // <-- 👈 userId -> socket.id

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

    // 👇 Jab frontend se user apna ID bhejta hai
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`🟢 User ${userId} is online`);

      // Broadcast to all clients
      io.emit("updateUserStatus", { userId, status: "online" });
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`🔵 User joined room: ${roomId}`);
    });

    socket.on("sendMessage", ({ roomId, message, sender }) => {
      console.log(`📨 Message from ${sender}: ${message}`);
      io.to(roomId).emit("receiveMessage", {
        message,
        sender,
        time: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      // 👇 Find and remove user from map
      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          console.log(`🔴 User ${userId} went offline`);
          io.emit("updateUserStatus", { userId, status: "offline" });
          break;
        }
      }

      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};
