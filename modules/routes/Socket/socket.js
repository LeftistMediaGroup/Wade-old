const { Server } = require("socket.io");

export default class Socket {
  constructor() {
    this.io = new Server({
    });

    this.startServer(io)
  }

  startServer = (io) => {
    io.on("connection", (socket) => {
      // ...
    });

    io.listen(3002);
  };
}
