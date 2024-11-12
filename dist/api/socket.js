import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import next from 'next';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = 3000;
app.prepare().then(() => {
    const expressApp = express();
    const server = http.createServer(expressApp);
    const io = new Server(server);
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // Broadcast new questions from the host
        socket.on("newQuestion", (question) => {
            io.emit("updateQuestion", question);
        });
        // Receive and broadcast answers
        socket.on("submitAnswer", (answerData) => {
            io.emit("receiveAnswer", answerData);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    expressApp.all('*', (req, res) => handle(req, res));
    server.listen(port, () => {
        console.log(`> Server running on http://localhost:${port}`);
    });
});
