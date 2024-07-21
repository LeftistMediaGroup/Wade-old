// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

var PouchDB = require("pouchdb");


export default class startTextArea {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;

        this.Init();
    }


    Init = () => {
        this.socket.on("Connection", () => {
        })
    }
};

