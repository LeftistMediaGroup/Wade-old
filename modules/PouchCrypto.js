// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

import bcrypt from "bcrypt";

const fs = require('fs');
var PouchDB = require("pouchdb");
PouchDB.plugin(require('transform-pouch'));


export class PouchCrypto {
    constructor(data, key) {
        this.data = data;
        this.key = key;
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

export function DatabasePouch_Init(url) {
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