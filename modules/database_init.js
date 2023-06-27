// Allow require
import { createRequire } from "module";

import * as dotenv from "dotenv";

//End require
const require = createRequire(import.meta.url);

dotenv.config();

var PouchDB = require("pouchdb");

export function Database_init_start(resolveDatabaseInit, rejectDatabaseInit) {
  var account_db = new PouchDB(
    `https://${process.env.host}:${process.env.port}/database/manifest`
  );
  account_db.info().then(function (info) {
    console.log(`\nManifest Returned Successfully\n`);
  });
  account_db
    .info()
    .catch(function (err) {
      console.log(`Error: ${err}`);
    })
    .then(function () {
      account_db
        .get("Manifest")
        .then(function (result) {
          console.log(`Returned Manifest:`);
        })
        .then(function () {
          account_db.get("Main").then(function (main) {
            resolveDatabaseInit();
          });
        })
        .catch(function (err) {
          if (err) {
            if (err.error === "not_found") {
              account_db
                .put({
                  _id: "Manifest",
                  data: {},
                })
                .then(function (result) {
                  console.log(
                    `Created Manifest: ${JSON.stringify(result, null, 2)}`
                  );
                })
                .then(function () {
                  //Put Main file
                  account_db
                    .put({
                      _id: "Main",
                      users: {},
                      system: {},
                      calendar: {},
                      kanban: {},
                      RSS: {},
                    })
                    .then(function (result) {
                      console.log(
                        `Created Main: ${JSON.stringify(result, null, 2)}`
                      );
                    })
                    .catch(function (err) {
                      console.log(`Error: ${JSON.stringify(err, null, 2)}`);
                    });

                  // Put Calendar file
                  function calendar() {
                    account_db
                      .put({
                        _id: "Calendar",
                        events: {},
                      })
                      .then(function (result) {
                        console.log(
                          `Created Calendar: ${JSON.stringify(result, null, 2)}`
                        );
                      })
                      .catch(function (err) {
                        console.log(`Error: ${JSON.stringify(err, null, 2)}`);
                      });
                  }

                  // Put Kanban file
                  function kanban() {
                    account_db
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
                    account_db
                      .put({
                        _id: "RSS",
                        RSS: {},
                      })
                      .then(function (result) {
                        console.log(
                          `Created RSS: ${JSON.stringify(result, null, 2)}`
                        );
                      })
                      .catch(function (err) {
                        console.log(`Error: ${JSON.stringify(err, null, 2)}`);
                      });
                  }

                  new Promise(() => {
                    calendar();
                  })
                    .then(kanban)
                    .then(rss)
                    .catch((err) => {
                      console.log(`Error: ${err}`);
                    });
                })
                .catch(function (err) {
                  console.log(`Error!: ${JSON.stringify(err, null, 2)}`);
                  rejectDatabaseInit(err);
                });
            } else {
              console.log(`Error!: ${JSON.stringify(err, null, 2)}`);
              rejectDatabaseInit(err);
            }
          }
        });
    })
    .catch(function (err) {
      console.log(`Error:! ${JSON.stringify(err, null, 2)}`);
      rejectDatabaseInit(err);
    });
}
