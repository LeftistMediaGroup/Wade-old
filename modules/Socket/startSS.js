// Allow require
import axios from "axios";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

import strftime from "strftime";

var PouchDB = require("pouchdb");


export default class start_SS {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;

        this.Init_SS();
    }

    Init_SS = () => {
        this.socket.on("Start_SS_VideoChat", () => {
            axios.post(`${process.env.Chat_URL}/api/v1/meeting`,
                {
                    "room": strftime("%y%m%d"),
                    "roomPassword": "false",
                    "audio": "false",
                    "video": "false",
                    "screen": "false",
                    "notify": "false",
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'DootDoot'
                    }
                }).then((result) => {
                    console.log(`URL Data Join: ${JSON.stringify(result.data.meeting, null, 2)}`);

                    this.io.to(this.socket.request.session.username).emit("Start_SS_VideoChatURL", result.data.meeting);
                })
                .catch((err) => {
                    console.log(`Err: ${JSON.stringify(err, null, 2)}`);
                })
        })
    }
};

