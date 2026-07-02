import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.cookie
          ?.split("; ")
          .find((c) => c.startsWith("auth_token="))
          ?.split("=")[1];

      console.log("token");
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
        username: string;
      };

      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
    io.on("connection", () => {
      const userId = socket.data.userId;
      socket.join(userId);
      console.log(`${userId} connected`);
      socket.on("disconnect", () => {
        console.log(`${userId} disconnected`);
      });
    });
  });

  return io;
};

export const getIO = () => io;
