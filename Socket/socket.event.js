const socketIo = require("socket.io");
const { EVENTS } = require("./events");

let __socket;

function setup() {
  __socket.on(EVENTS.CONNECTION, (socket) => {
    console.log(`SOCKET: ${socket.id} connected`);
    socket.on(EVENTS.DISCONNECT, () => {
      console.log(`SOCKET: ${socket.id} disconnected`);
    });
  });
}

exports.socketConnection = (server) => {
  __socket = new socketIo.Server(server, {
    cors: {
      origin: "*",
    },
    path: "/api/socket",
  });
  setup();
  return __socket;
};
