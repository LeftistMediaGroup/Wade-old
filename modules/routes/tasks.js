// Allow require
import { createRequire } from "module";
import { v4 } from "uuid";
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

var express = require("express");
var router = express.Router();

var strftime = require("strftime");

import * as dotenv from "dotenv";


dotenv.config();

router.get("/out", (req, res) => {
    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
        .info()
        .then(() => {
            users_db
                .get(`${req.session.username}`)
                .then((result) => {
                    console.log(`Result: ${JSON.stringify(result.tasks, null, 2)}`);
                    res.json(result.tasks);
                    res.end();
                })
        });

});

router.put("/taskIn", (req, res) => {
    console.log(`Data: ${JSON.stringify(req.body)}`);

    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
        .info()
        .then(() => {
            users_db
                .get(`${req.session.username}`)
                .then((result) => {
                    console.log(`Result: ${JSON.stringify(result.tasks, null, 2)}`);

                    let isFirst = new Promise((resolve, reject) => {
                        let blank = {}

                        let ID = `${req.body.taskName}-${v4()}`;

                        if (result.tasks === blank) {
                            result.tasks = {
                                [`${ID}`]: {
                                    id: 'root',
                                    name: 'Tasks',
                                    children: [
                                        {
                                            id: ID,
                                            name: req.body.taskName,
                                        }
                                    ],
                                }
                            }
                            resolve();
                        } else {
                            let ID = `${req.body.taskName}-${v4()}`
                            result.tasks[`${ID}`] = {
                                id: ID,
                                name: req.body.taskName,
                                children: []
                            }
                            resolve();
                        }
                    })

                    isFirst
                        .then(() => {
                            users_db.put(result).then((putResult) => {
                                console.log(`Put Result: ${JSON.stringify(putResult, null, 2)}`);
                            })
                                .catch((err) => {
                                    console.log(`Error ${JSON.stringify(err, null, 2)}`);
                                });
                        })
                        .then(() => {
                            res.json(result.tasks);
                            res.end();
                        });
                })
        });


});


router.put("/subTaskIn", (req, res) => {
    console.log(`Data: ${JSON.stringify(req.body, null, 2)}`);

    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
        .info()
        .then(() => {
            users_db
                .get(`${req.session.username}`)
                .then((result) => {
                    console.log(`Result: ${JSON.stringify(result.tasks, null, 2)}`);

                    let updatePartent = new Promise(() => {
                        let ID = `${req.body.subTaskName}-${v4()}`


                        console.log(`Parent ID: ${`${JSON.stringify(req.body.parent.id, null, 2)}`}`);
                        console.log(`Parent Children: ${JSON.stringify(result["tasks"][req.body.parent.id]["children"], null, 2)}`);



                        result["tasks"][req.body.parent.id]["children"].push({
                            id: ID,
                            name: req.body.subTaskName,
                            children: []
                        })

                        console.log(`Parent Children: ${JSON.stringify(result["tasks"][req.body.parent.id]["children"], null, 2)}`);

                        users_db.put(result).then((result2) => {
                            console.log(`Result2: ${JSON.stringify(result2, null, 2)}`)
                        }).catch((err) => {
                            console.log(`Error: ${err}`)
                        })

                        res.json(result.tasks);
                        res.end();

                    })
                })
        });


});



export default router;
