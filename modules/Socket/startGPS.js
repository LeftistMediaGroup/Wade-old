// Allow require
import { createRequire } from "module";
import strftime from "strftime";
import { v4 } from "uuid";

const require = createRequire(import.meta.url);
//End require

const Gpsd = require("node-gpsd-client");

var PouchDB = require("pouchdb");
PouchDB.plugin(require('pouchdb-upsert'));


export default class StartGPS {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;

    this.InitGPSIO();
  }

  InitGPSIO = () => {
    this.socket.on("track_user", (data) => {
      let user = data;

      this.socket.join(user);

      this.InitGPSD(user);
    })
  };

  InitGPSD = (user) => {
    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
      .info()
      .then(() => {
        users_db
          .get(user)
          .then((result) => {
            console.log(`Init Result IN: ${JSON.stringify(result, null, 2)}`);

            new Promise((resolve, reject) => {
              if (!result.GPS) {
                result.GPS = {};
              }
              resolve(result);
            }).then((result) => {
              users_db.put(result).catch((err) => {
                console.log(`Error: ${JSON.stringify(err, null, 2)}`);
              })

            })
          })
      }).catch((err) => {
        console.log(`Error: ${JSON.stringify(err, null, 2)}`);
      });

    console.log(`Initializing GPSD for user: ${user}`);

    const client = new Gpsd({
      port: 2947, // default
      hostname: "localhost", // default
      parse: true,
    });

    client.on("connected", () => {
      console.log(`Gpsd client connected for user: ${user}`);
      client.watch({
        class: "WATCH",
        json: true,
        scaled: true,
      });

      users_db.get(user).then((userData) => {
        let Historical_data = userData.GPS;

        this.io.to(user).emit("Historical_data", {
          data: Historical_data
        });
      });
    });

    client.on("error", (err) => {
      console.log(`Gpsd error: ${err.message}`);
    });

    client.on("TPV", (data) => {
      console.log(`TPV: ${data}`);

      let id = `${strftime("%y%m%d")}_${v4()}`;

      data.id = id;

      users_db
        .get(user).then((users) => {
          users.GPS[id] = data;

          users_db.putIfNotExists(users).catch((err) => {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
          })
        });

      this.io.to(user).emit("GPS_data", {
        data: data
      });
    });

    client.connect();
  };
}
