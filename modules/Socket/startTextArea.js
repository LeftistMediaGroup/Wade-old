// Allow require
import { createRequire } from "module";
import strftime from "strftime";
const require = createRequire(import.meta.url);
//End require
import { toJSON, fromJSON } from 'flatted';



var PouchDB = require("pouchdb");


export default class startTextArea {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;

        this.InitTextArea();
    }


    InitTextArea = () => {
        this.socket.on("TextArea_Connection", (day) => {
            this.GetEntry(this.socket.handshake.session.username, day);
        })

        this.socket.on("TextArea_Entry", ({ entry, date }) => {
            console.log(`Entry: ${JSON.stringify(entry, null, 2)}`);
            this.updateDailyEntry(entry, date);
        })
    }

    updateDailyEntry = (entry, date) => {
        let user = this.socket.handshake.session.username;

        var users_db = new PouchDB(`https://${process.env.host}/database/users`);

        users_db.get(user).then((result) => {
            if (!result.journal) {
                result.journal = {
                }
            }

            result.journal[date] = entry;

            console.log(`Result IN: ${JSON.stringify(result, null, 2)}`);

            users_db.put(result)

            console.log(`Entry In: ${JSON.stringify(entry)}`)
            this.returnDailyEntry(entry);
        });
    }

    returnDailyEntry = (entry) => {
        this.io.to(this.socket.handshake.session.username).emit("TextArea_returnDailyEntry", entry);
    }

    GetEntry = (user, day) => {
        var users_db = new PouchDB(`https://${process.env.host}/database/users`);

        console.log(`Day: ${day}`)
        users_db.get(user).then((result) => {
            if (!result.journal) {
                result.journal = {
                }
                this.io.to(this.socket.handshake.session.username).emit("TextArea_Entry", "Journal Empty");
            } else {
                if (result.journal[day]) {
                    this.io.to(this.socket.handshake.session.username).emit("TextArea_Entry", result.journal[day]);
                } else {
                    this.io.to(this.socket.handshake.session.username).emit("TextArea_Entry", "No Entry");
                }
            }
        });
    }
};

