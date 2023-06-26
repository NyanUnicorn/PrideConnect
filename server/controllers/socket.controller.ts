const { User, Room, Message, UserRoom } = require('../models/db.model'); // adjust this to match your actual models

const socketController = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });

    // When a user joins a room
    socket.on('join', async ({ room, user }) => {
      // Joins the socket room
      socket.join(room);
      
      // Updates the database to reflect the new user in the room
      const foundRoom = await Room.findOrCreate({ where: { name: room } });
      const foundUser = await User.findOrCreate({ where: { name: user } });

      await UserRoom.create({
        userId: foundUser[0].id,
        roomId: foundRoom[0].id,
      });

      // Broadcast to room that a new user has joined
      io.to(room).emit('userJoined', `${user} has joined the room.`);
    });

    // When a user leaves a room
    socket.on('leave', async ({ room, user }) => {
      // Leaves the socket room
      socket.leave(room);
      
      // Update the database to reflect the user leaving the room
      const foundRoom = await Room.findOne({ where: { name: room } });
      const foundUser = await User.findOne({ where: { name: user } });

      await UserRoom.destroy({
        where: {
          userId: foundUser.id,
          roomId: foundRoom.id,
        }
      });

      // Broadcast to room that a user has left
      io.to(room).emit('userLeft', `${user} has left the room.`);
    });

    // When a user sends a message
    socket.on('message', async ({ room, user, message }) => {
      // Create the new message in the database
      const foundRoom = await Room.findOne({ where: { name: room } });
      const foundUser = await User.findOne({ where: { name: user } });

      await Message.create({
        content: message,
        roomId: foundRoom.id,
        senderId: foundUser.id,
      });

      // Broadcast the message to everyone in the room
      io.to(room).emit('newMessage', { user, message });
    });
  });
}

module.exports = socketController;
