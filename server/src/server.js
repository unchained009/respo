import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import { prisma } from './config/prisma.js';
import { setSocketServer } from './config/socket.js';

dotenv.config();


import cors from "cors";



const startServer = async () => {
  await prisma.$connect();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  });

  setSocketServer(io);

  io.on('connection', (socket) => {
    socket.on('join:admin', (restaurantId) => {
      if (restaurantId) {
        socket.join(`admins:${restaurantId}`);
      }
    });

    socket.on('join:order', (orderId) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
      }
    });

    socket.on('disconnect', () => {
      socket.leaveAll();
    });
  });

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
