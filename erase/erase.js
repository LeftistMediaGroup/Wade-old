// Allow require
import { createRequire } from "module";

import * as dotenv from "dotenv";

dotenv.config();


//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");



let databases = [
    new PouchDB(`http://${process.env.host}:${process.env.port}/database/manifest`),
];

databases.forEach((database) => {
database.destroy() 
})