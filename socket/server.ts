import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const DEVELOPMENT = process.env.NODE_ENV === "development";

io.on("connection", (socket) => {
  if (DEVELOPMENT) {
    console.log(`Socket connected: ${socket.id}`);
  }

  socket.on("joinChat", (body) => {
    if (DEVELOPMENT) {
      console.log(`${socket.id} joined ${body.roomId}`);
    }
    socket.join(body.roomId);
  });

  socket.on("messageOut", (body) => {
    if (DEVELOPMENT) {
      console.log(body);
    }

    io.in(body.roomId).emit("messageIn", {
      id: body.id,
      text: body.text,
      ownerId: body.ownerId,
      ownerUsername: body.ownerUsername,
      createdAt: body.createdAt,
    });
  });
});

httpServer.listen(8080, () => {
  if (DEVELOPMENT) {
    console.log(`Socket server listening on port 8080`);
  }
});
