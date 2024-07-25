// Allow require
import { createRequire } from "module";
import express from 'express';
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')

const dirTree = require("directory-tree");
var PouchDB = require("pouchdb");
PouchDB.plugin(require('pouchdb-adapter-memory'));


var router = express.Router();

router.get('/get_all', (req, res) => {
    let Vault1 = dirTree("Vault-1", { exclude: /AlbumArt/ });

    res.json(Vault1);
});

router.put('/is_active', (req, res) => {
    let songs = req.body.songs;

    var Music_db = new PouchDB(`https://${process.env.host}/database/AllMusic`);

    Music_db.info().then(() => {
        Music_db.get("Main").then((result) => {
            new Promise((resolve, reject) => {
                Object.values(result.songs).forEach((resultSong) => {
                    Object.values(songs).forEach((song) => {
                        new Promise((resolve, reject) => {
                            let found = false

                            if (song.name === resultSong.name) {
                                found = true

                                resolve(found)
                            }
                        }).then((found) => {
                            if (found === false) {
                                resultSong.is_active = false;
                            }
                        })
                    })
                })
                resolve()
            }).then(() => {
                res.json(result.songs)
            })
        })
    })
});

router.put('/set_active', (req, res) => {
    let song = req.body.song;
    let status = req.body.status;

    var Music_db = new PouchDB(`https://${process.env.host}/database/AllMusic`);

    Music_db.info().then(() => {
        Music_db.get("Main").then((result) => {
            new Promise((resolve, reject) => {
                Object.values(result.songs).forEach((resultSong) => {
                    if (resultSong.name === song) {
                        resultSong.is_active = status;
                    }
                })
                resolve()
            }).then(() => {
                Music_db.put(result);
                res.json(result.songs)
            })
        })
    })
})

router.get('/get_active', (req, res) => {
    var Music_db = new PouchDB(`https://${process.env.host}/database/AllMusic`);

    let Songs = {};

    Music_db.info().then(() => {
        Music_db.get("Main").then((result) => {
            Object.values(result.songs).forEach((song) => {
                if (song.is_active === true) {
                    Songs[song.name] = song;
                }
            })

            res.json(Songs)
        }).catch(function (err) {
            if (err.error === "not_found") {

                res.json(Songs)
            }
        });
    })

});

export default router;

