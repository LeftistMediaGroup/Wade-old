// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

import { Express_Init_Start } from "./modules/express_init.js";
import { Database_init_start } from "./modules/database/database_init.js";
import startRSS from "./modules/RSS/rss.js";
import Replicator from "./modules/replicator.js";
import SSL_Init from "./modules/SSL_Init.js"
//import SundaySocial from "./SundaySocial.js";


require('events').EventEmitter.defaultMaxListeners = 100;


async function Start() {
  await Promise.all([SSL_Init(), Database_init_start(), Express_Init_Start()
  ])
    .then(() => {
      console.log(`Database Online`);

    })
    .catch((err) => {
      console.log(`Error starting Database, see the following logs: ${err}`)
    })
}

Start();

