// Allow require
import { createRequire } from "module";

import * as dotenv from "dotenv";

dotenv.config();


//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");



let databases = [
    new PouchDB(`https://${process.env.host}/database/data`),
];

databases.forEach((database) => {
database.destroy() 
})