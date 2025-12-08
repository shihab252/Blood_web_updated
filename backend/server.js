import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ----- SOCKET.IO SETUP -----
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store connected users
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io usable in controllers
app.set("io", io);

// ----- MIDDLEWARE -----
app.use(cors());
app.use(express.json());

// ----- ROUTES -----
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static("uploads"));



app.get("/", (req, res) => res.send("API Running..."));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
// Auto-expire check (runs every minute)
const expireWorker = async () => {
  try {
    const RequestModel = (await import("./models/Request.js")).default;
    const NotificationModel = (await import("./models/Notification.js")).default;

    const now = new Date();
    const expired = await RequestModel.find({ status: "Pending", expiresAt: { $lte: now } });
    if (expired.length) {
      for (const reqItem of expired) {
        reqItem.status = "Expired";
        await reqItem.save();

        // notify requester
        await NotificationModel.create({
          user: reqItem.requester,
          type: "request_expired",
          title: "Your request expired",
          body: `Your request for ${reqItem.patientName} has expired.`,
          meta: { requestId: reqItem._id },
        });

        const io = app.get("io");
        const socketId = global.onlineUsers.get(String(reqItem.requester));
        if (socketId && io) io.to(socketId).emit("requestExpired", { requestId: reqItem._id });
      }
    }
  } catch (err) {
    console.error("expireWorker error:", err);
  }
};

setInterval(expireWorker, 60 * 1000); // every 60s
