// Allow require
import { createRequire } from "module";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

//End require
const require = createRequire(import.meta.url);
var PouchDB = require("pouchdb");

var express = require("express");
var router = express.Router();

var strftime = require("strftime");

dotenv.config();

router.put("/get_contacts", (req, res) => {
    var user_db = new PouchDB(`https://${process.env.host}/database/users`);

    user_db.info().then(function (info) {
        user_db
            .get(`${req.session.username}`)
            .then(function (result) {
                res.json(result.contacts);
                res.end();
            })
            .catch(function (err) {
                res.json({ Error: `${JSON.stringify(err, null, 2)}` });
                res.end();
            });
    });
});

router.put("/get_users", (req, res) => {
    var user_db = new PouchDB(`https://${process.env.host}/database/users`);

    let users = {};

    user_db.info().then(function () {
        user_db
            .allDocs({
                include_docs: true,
            })
            .then((result) => {
                for (let user of result.rows) {
                    users[user.doc.username] = {
                        username: user.doc.username,
                    };
                }
            })
            .then(() => {
                res.json(users);
                res.end();
            })
            .catch(function (err) {
                res.json({ Error: `${JSON.stringify(err, null, 2)}` });
                res.end();
            });
    });
});

router.put("/addContact", (req, res) => {
    var user_db = new PouchDB(`https://${process.env.host}/database/users`);

    user_db.info().then(function () {
        user_db
            .get(`${req.session.username}`)
            .then((result) => {
                new Promise((resolve, reject) => {
                    if (!result.contacts) {
                        result.contacts = {};
                    }
                    resolve();
                }).then(() => {
                    result.contacts[req.body.contact] = {
                        username: req.body.contact,
                    };

                    user_db
                        .info()
                        .then(() => {
                            user_db.put(result);
                        })
                        .then(() => {
                            user_db.get(`${req.body.contact}`).then((result2) => {
                                new Promise((resolve, reject) => {

                                    if (!result2.contacts) {
                                        result2.contacts = {};
                                    }
                                }).then(() => {

                                    result2.contacts[req.session.username] = {
                                        username: req.session.username,
                                    };

                                    user_db.put(result2);
                                });
                            });
                        })
                        .then(() => {
                            res.json({ status: "Worked" });

                            res.end();
                        })
                        .catch(function (err) {
                            res.json({ Error: `${JSON.stringify(err, null, 2)}` });
                            res.end();
                        });

                })
                    .catch(function (err) {
                        res.json({ Error: `${JSON.stringify(err, null, 2)}` });
                        res.end();
                    });
            });
    });
});

export default router;