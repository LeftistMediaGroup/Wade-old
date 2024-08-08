// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

import * as dotenv from "dotenv";
import { Crypto_Init, Pouch_Init } from "./PouchCrypto.js";
dotenv.config();


export function Database_init_start() {
  console.log(`Initalizing Database`)

  let url = `https://${process.env.host}/database/data`;

  let data_db = new Crypto_Init(url);

  data_db
    .get("Main")
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
            data_db
              .put({
                _id: "Main",
                users: {},
                system: {},
                admin_created: false,
              })
              .then(function (main) {
                console.log(`Main returned: ${JSON.stringify(main, null, 2)}`);
              });
          }

          Promise.all([Manifest(), Main()])
            .catch((err) => {
              console.log(`Error: ${err}`);
            });
        }
        if (err.name === "unauthorized" || err.name === "forbidden") {
          console.log(`Login name or password incorrect`);
        } else {
          console.log(`Error ${JSON.stringify(err, null, 2)}`);
        }
      }
    });
}


