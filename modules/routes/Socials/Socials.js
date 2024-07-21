// Allow require
import { createRequire } from "module";
import express from 'express';
import axios from "axios";
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')
var PouchDB = require("pouchdb");


var router = express.Router();



router.put('/submit_page', (req, res) => {
    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
        .info()
        .then(() => {
            users_db
                .get(`${req.session.username}`)
                .then((result) => {
                    new Promise(() => {
                        new Promise(() => {
                            if (!result.socials.pageTokens) {
                                result.socials.pageTokens = {}
                            }
                        }).then(() => {
                            result["socials"]["pageTokens"][req.body.name] = {
                                name: req.body.name,
                                token: req.body.token,
                                id: req.body.id,
                                addedBy: req.body.username

                            }
                        })
                    })
                        .then(() => {
                            users_db.put(result)
                                .catch((err) => {
                                    console.log(`Error: ${JSON.stringify(err, null, 2)}`)
                                })
                        })
                        .then(() => {
                            res.json("Added Page");
                            res.end();
                        })

                })
        })

});


router.put('/out', (req, res) => {
    /*
    var socials_db = new PouchDB(`https://${process.env.host}/database/social`);
      
    socials_db.info().then((result) => {
        console.log(`Socials: ${JSON.stringify(result, null, 2)}`)
        res.json(socials)
        res.end();
    })
    */

    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
        .info()
        .then(() => {
            users_db
                .get(`${req.session.username}`)
                .then((result) => {
                    if (!result.socials) {
                        res.json("Please Log in")
                        res.end();
                    } else {
                        if (!result.socials.pageTokens) {
                            res.json("No Page Tokens")
                            res.end();
                        }
                    }
                })
        })
});


router.put('/new_feed', (req, res) => {
    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
        .info()
        .then(() => {
            users_db
                .get(`${req.session.username}`)
                .then((result) => {

                    axios
                        .get(`https://graph.facebook.com/${result.socials.settings.user_id}/accounts?access_token=${result.socials.settings.token}`, {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        })
                        .then((result) => {
                            console.log(`Pages: ${JSON.stringify(result.data, null, 2)}`)

                            res.json(result.data)
                            res.end()
                        }).catch((err) => {
                            if (err.code === "ERR_BAD_REQUEST") {
                                res.json("Token Expired, Log in Again")
                                res.end();
                            }
                            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
                        });
                })
        })
});

router.put('/token_in', (req, res) => {
    190
    console.log(`Token: ${req.body.token}`);

    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db
        .info()
        .then(() => {
            users_db
                .get(`${req.session.username}`)
                .then((result) => {
                    if (!result.socials) {
                        result.socials = {
                            settings: {
                                token: req.body.token,
                                user_id: req.body.user_id
                            },
                        }
                    } else {
                        result.socials.settings = {
                            token: req.body.token,
                            user_id: req.body.user_id,
                        }
                    }

                    users_db.put(result)
                        .then(() => {
                            res.json("Token Updated")
                            res.end();
                        })

                })

        });

})

router.get('/is_token', (req, res) => {
    var users_db = new PouchDB(`https://${process.env.host}/database/users`);

    users_db.info()
        .then(() => {
            users_db.get(`${req.session.username}`)
                .then((result) => {
                    if (!result.socials) {
                        res.json("No Token")
                        res.end();
                    } else {
                        if (!result.socials.settings.token) {
                            res.json("No Token")
                            res.end();
                        } else {

                            axios
                                .get(`https://graph.facebook.com/${result.socials.settings.user_id}/accounts?access_token=${result.socials.settings.token}?metadata=1`, {
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                    }
                                })
                                .then((result) => {
                                    console.log(`Pages: ${JSON.stringify(result.data, null, 2)}`)

                                    res.json("Token")
                                    res.end();
                                }).catch((err) => {
                                    if (err.code === "ERR_BAD_REQUEST") {
                                        res.json("Token Expired, Log in Again")
                                        res.end();
                                    }
                                    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
                                });
                        }
                    }
                })
        })
})

export default router;







/*
        axios
        .get(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.facebook_app_id}&client_secret=${process.env.facebook_app_secret}&grant_type=client_credentials`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
        .then((result) => {
            console.log(`Result: ${JSON.stringify(result.data, null, 2)}`);
            let access_token = result.data

            axios
                .get(`https://graph.facebook.com/LMGMemes1?access_token=${access_token}`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then((pageResult) => {
                    console.log(`Page Result: ${JSON.stringify(pageResult, null, 2)}`)
                }).catch((err) => {
                    console.log(`Error: ${err}`)
                })

        }).catch((err) => {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`)
        })

axios
        .get(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.facebook_app_id}&client_secret=${process.env.facebook_app_secret}&grant_type=client_credentials`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
        .then((result) => {
            console.log(`Result: ${JSON.stringify(result.data, null, 2)}`);
            let access_token = result.data

            axios
                .get(`https://graph.facebook.com/LMGMemes1?access_token=${access_token}`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then((pageResult) => {
                    console.log(`Page Result: ${JSON.stringify(pageResult, null, 2)}`)
                }).catch((err) => {
                    console.log(`Error: ${err}`)
                })

        }).catch((err) => {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`)
        })






*/
