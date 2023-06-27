import { Express_Init_Start } from "./modules/express_init.js";
import { Database_init_start } from "./modules/database_init.js";
import startRSS from "./modules/RSS/rss.js";

function Start() {
  new Promise(() => {
    try {
      let value = Express_Init_Start();
      resolveExpressInit(value);
    } catch (err) {
      rejectExpressInit(err);
    }
  });

  function resolveExpressInit() {
    new Promise(() => {
      Database_init_start(resolveDatabaseInit, rejectDatabaseInit);
    });
  }

  function resolveDatabaseInit() {
    startRSS();
  }

  function rejectExpressInit(err) {
    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
  }
  function rejectDatabaseInit(err) {
    console.log(`Reject Database InitError: ${JSON.stringify(err, null, 2)}`);
    resolveDatabaseInit();
  }
}

Start();
