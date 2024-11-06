import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function useSocket(): Socket {
    const [socketInstance, setSocketInstance] = useState<Socket>();

    useEffect(() => {
        if (!socket) {
            socket = io();
            setSocketInstance(socket);
        }
    }, []);

    return socket;
}
