// Allow require
import { createRequire } from "module";

const require = createRequire(import.meta.url);
//End require


import { Express_Init_Start } from "./modules/express_init.js";
import { Database_init_start } from "./modules/database_init.js";
import startRSS from "./modules/RSS/rss.js";
import Replicator from "./modules/replicator.js";
import Dev from "./dev.js";
//import SundaySocial from "./SundaySocial.js";


require('events').EventEmitter.defaultMaxListeners = 100;
async function Start() {
  new Promise((resolve, reject) => {
    new Dev(resolve);
  })
    .then(() => {
      try {
        let value = Express_Init_Start();
        resolveExpressInit(value);
      } catch (err) {
        rejectExpressInit(err);
      }
    });

  new Promise(() => {
    //new Replicator();
  });

  async function resolveDatabaseInit() {
    console.log(`\nDatabase Online!\n`);

    //SundaySocial();

    //await startRSS
  }

  function resolveExpressInit() {
    Database_init_start(resolveDatabaseInit);
  }

  function rejectExpressInit(err) {
    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
  }
}

Start();

