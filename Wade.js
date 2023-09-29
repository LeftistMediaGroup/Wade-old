import { Express_Init_Start } from "./modules/express_init.js";
import { Database_init_start } from "./modules/database_init.js";
import startRSS from "./modules/RSS/rss.js";
import Replicator from "./modules/replicator.js";

async function Start() {
  new Promise(() => {
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

    await startRSS();
  }

  function resolveExpressInit() {
    Database_init_start(resolveDatabaseInit);
  }

  function rejectExpressInit(err) {
    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
  }
}

Start();
