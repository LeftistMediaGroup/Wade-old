// Allow require
import { createRequire } from "module";

import { Blob } from 'buffer';
import * as fs from 'fs';

//End require
const require = createRequire(import.meta.url);

/*
var PouchDB = require('pouchdb');

<<<<<<< HEAD
var manifest_db = new PouchDB(`https://${process.env.host}/sync/manifest`);
=======
var manifest_db = new PouchDB(`https://localhost/sync/manifest`);
>>>>>>> main
*/


export default function InputFolderReadInit(folderPath){
    console.log(`InputFolder Init`);

    let folderData  = fs.readdirSync(folderPath, {
        encoding: "buffer",
        withFileTypes: true,
    });

    console.log(`FolderData: ${JSON.stringify(folderData, null, 2)}`);
};