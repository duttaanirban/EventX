import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
  });
  io.on('connection', (socket) => {
    socket.on('join-event', (eventId) => socket.join(`event:${eventId}`));
    socket.on('join-organizer', (organizerId) => socket.join(`organizer:${organizerId}`));
  });
  return io;
};

export const getIo = () => io;
