const { Server } = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000',
      },
    });
    return io;
  },
  getSocket: () => {
    if (!io) {
      throw new Error('Not established socket');
    }
    return io;
  },
};
