// Allow require
import { createRequire } from "module";

import * as dotenv from "dotenv";

//End require
const require = createRequire(import.meta.url);

dotenv.config();

var PouchDB = require("pouchdb");

export function Database_init_start(resolveDatabaseInit, rejectDatabaseInit) {
  var data_db = new PouchDB(
    `http://${process.env.host}:${process.env.port}/database/data`
  );

  data_db
    .get("Main")
    .then(function (main) {
      console.log(`\nReturned Main: ${JSON.stringify(main, null, 2)}\n`);

      console.log(`Database Online!`);
    })
    .catch(function (err) {
      if (err) {
        if (err.error === "not_found") {
          // Put Manifest File

          function Manifest() {
            data_db.put({
              _id: "Manifest",
              data: {},
            });
          }

          //Put Main File
          function Main() {
            data_db.put({
              _id: "Main",
              users: {},
              system: {},
              calendar: {},
              kanban: {},
              RSS: {},
              Back: {},
            });
          }

          // Put Calendar file
          function calendar() {
            data_db
              .put({
                _id: "Calendar",
                events: {},
              })
              .catch(function (err) {
                console.log(`Error: ${JSON.stringify(err, null, 2)}`);
              });
          }

          // Put Kanban file
          function kanban() {
            data_db
              .put({
                _id: "Kanban",
                columns: {},
                tasks: {},
              })
              .then(function (result) {
                console.log(
                  `Created Kanban: ${JSON.stringify(result, null, 2)}`
                );
              })
              .catch(function (err) {
                console.log(`Error: ${JSON.stringify(err, null, 2)}`);
              });
          }

          // Put RSS file
          function rss() {
            data_db
              .put({
                _id: "RSS",
                RSS: {},
              })
              .catch(function (err) {
                console.log(`Error: ${JSON.stringify(err, null, 2)}`);
              });
          }

          Promise.all(Manifest(), Main(), calendar(), rss())
            .then(console.log(`\nDatabase Online!\n`))
            .catch((err) => {
              console.log(`Error: ${err}`);
            });
        }
      }
    });
}
