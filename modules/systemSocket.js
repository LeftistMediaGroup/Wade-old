import { createServer } from "http";
import { Server } from "socket.io";

export default function systemSocket() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
      cors: {
          origin: `*`,
      }
  });

  io.on("connection", (socket) => {
    socket.emit("message", "connected!");
  });

  httpServer.listen(4001);

  console.log("System socket listening on 4001");
}