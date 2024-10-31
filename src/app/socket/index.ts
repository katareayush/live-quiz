import { io, Socket } from "socket.io-client";

const socket: Socket = io({
   path: "/api/socket",
   transports: ["websocket"],
});

export default socket;