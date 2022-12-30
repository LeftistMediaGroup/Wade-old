import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: `*`,
    }
});

io.on("connection", (socket) => {
  socket.emit("message", "connected!");
});

httpServer.listen(6001);