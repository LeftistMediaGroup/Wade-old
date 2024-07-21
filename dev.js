// Allow require
import { createRequire } from "module";

const require = createRequire(import.meta.url);
//End require

import fs from 'fs';
const exec = require('child_process').exec;


export default function Dev(resolve) {

    fs.stat('./key.pem', function (err, stat) {
        if (err == null) {
            console.log('SSL File exists');
            resolve();
        } else if (err.code === 'ENOENT') {

            console.log(`No SSL file, generating now. Standby 3 sec`)

            console.log(`3...`)

            setTimeout(() => {
                console.log(`2..`)

            }, 1000)

            setTimeout(() => {
                console.log(`1. \n`)

            }, 2000)

            setTimeout(() => {
                let command = "openssl req -x509 -newkey rsa:4096 -keyout key.pem -out certificate.pem -sha256 -days 365 -subj '/CN=100.106.167.126:3001' -nodes"

                exec(command,
                    (error, stdout, stderr) => {
                        console.log(`${stdout}`);
                        console.log(`${stderr}`);

                        console.log(`Starting Feeler init, Standby 3 sec`);

                        setTimeout(resolve, 3000)

                        console.log(`3...`)

                        setTimeout(() => {
                            console.log(`2..`)

                        }, 1000)

                        setTimeout(() => {
                            console.log(`1. \n`)

                        }, 2000)

                        if (error !== null) {
                            console.log(`exec error: ${error}`);
                        }
                    });
            }, 3000)
        }
    });
}

