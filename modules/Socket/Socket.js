// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

import StartMessages from "./StartMessages.js";
import StartGPS from "./startGPS.js";
import startTextArea from "./startTextArea.js";
import start_SS from "./startSS.js";


var PouchDB = require("pouchdb");



export default class Socket {
    constructor(io) {
        this.io = io;
        this.InitSocketIO();
    }

    InitSocketIO = () => {
        this.io.on("connection", (socket) => {
            let username = socket.request.session.username;

            socket.join(username);

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            new StartGPS(this.io, socket);
            new StartMessages(this.io, socket);
            new startTextArea(this.io, socket);
            new start_SS(this.io, socket);

            //new StartESP(this.io, socket);

        });
    };
};