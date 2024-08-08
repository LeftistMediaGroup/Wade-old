// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

import { exit } from "process";
import bcrypt from "bcrypt";

const fs = require('fs');

var PouchDB = require("pouchdb");
PouchDB.plugin(require('transform-pouch'));


export class Crypto_Init {
    constructor(url) {
        if (typeof process.env.KEY_INIT !== "undefined") {
            if (typeof process.env.IV_VALUE !== "undefined") {
                let db = Pouch_Init(url);

                return db;

            } else {
                console.log(`Database Cryptography Initializing`);

                let KEY_INIT = process.env.KEY_INIT;

                console.log(`!!!! !!!!`);

                console.log(`
                    1. SAVE THIS VALUE IN A SECURE PLACE\n
                    2. Add IV_VALUE="VALUE-THAT-WAS-DISPLAYED-IN-TERMINAL" to .env and restart\n
                    IT WILL ONLY BE SHOWN ONCE\n
                    IF YOU LOOSE THIS KEY, OR SOMEONE GETS IT\n
                    YOU LOOSE ACCESS TO EVREYTHING!\n
                    `)


                const IV = bcrypt.hashSync(KEY_INIT, 10);

                console.log(`!!!! !!!!`)

                console.log(`IV Value:\n`);
                console.log(`${IV}`)
                console.log(`!!!! !!!!`);
                exit();
            }
        } else {
            console.log(`NO KEY_INIT value found in .env`);
            console.log(`Add KEY_INIT="YOUR-NEW-VALUE-HERE" to .env and restart`)
            exit();
        }
    }
}

export class PouchCrypto {
    constructor(data, key) {
        this.data = data;
        this.key = key;

        this.IV = process.env.IV_VALUE;
    }

    static encrypt = function () {
        try {
            let val = JSON.stringify(this.data);

            let cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.IV);
            let encrypted = cipher.update(val, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;

        } catch (err) {
            console.log(`
                Report Error to system adminastrator:
                GTFKD
                pray to your god if you have one
                ${JSON.stringify(err, null, 2)}
            `)
        }

    }

    static decrypt = function () {
        try {
            let val = JSON.stringify(this.data);

            let cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.IV);
            let encrypted = cipher.update(val, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        } catch (err) {
            console.log(`
                Report Error to system adminastrator:
                GTFKD
                pray to your god if you have one
                ${JSON.stringify(err, null, 2)}
            `)
        }

    }
}

export function Pouch_Init(url) {
    try {
        var data_db = new PouchDB(url);

        data_db.transform({
            incoming: function (doc) {
                Object.keys(doc).forEach(function (field) {
                    if (field !== '_id' && field !== '_rev' && field !== '_revisions') {
                        doc[field] = PouchCrypto.encrypt(doc[field]);
                    }
                });
                return doc;
            },
            outgoing: function (doc) {
                Object.keys(doc).forEach(function (field) {
                    if (field !== '_id' && field !== '_rev' && field !== '_revisions') {
                        doc[field] = PouchCrypto.decrypt(doc[field]);
                    }
                });
                return doc;
            }
        });

        return data_db;
    } catch (err) {
        console.log(`
            Report Error to system adminastrator:
            GTFKD
            pray to your god if you have one
            ${JSON.stringify(err, null, 2)}
        `)
    }
}