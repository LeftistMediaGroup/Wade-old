// Allow require
import { createRequire } from "module";
import express from 'express';
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')
var PouchDB = require("pouchdb");

var router = express.Router();


router.put('/getStickerCampaigns', function (req, res) {

    let stickerURL = req.body.stickerURL;
    console.log(`StickerURL: ${stickerURL}`)

    var AdminStickerCampaigns_db = new PouchDB(
        `https://${process.env.host}/AdminStickerCampaigns/${stickerURL}`
    );

    AdminStickerCampaigns_db
        .get("Main")
        .then(function (doc) {
            console.log(`getStickerCampaigns Result: ${JSON.stringify(doc, null, 2)}`)
            res.json(doc)
        }).catch(function (err) {
            if (err.error === "not_found") {
                console.log(`URL Not Found: ${JSON.stringify(stickerURL, null, 2)}`);
                res.json(false)
            }
        })


});

router.put('/toggleActivated', function (req, res) {
    let data = req.body;
    let url = data.stickerURL;
    console.log(`Data: ${JSON.stringify(data, null, 2)}`)

    var AdminStickerCampaigns_db = new PouchDB(
        `https://${process.env.host}/AdminStickerCampaigns/${url}`
    );

    AdminStickerCampaigns_db
        .get("Main")
        .then(function (doc) {
            console.log(`Result: ${JSON.stringify(doc, null, 2)}`)
            doc.activated = data.activated;

            AdminStickerCampaigns_db
                .put(doc)
                .then(function (result) {
                    console.log(`Result: ${JSON.stringify(result, null, 2)}`)
                    res.json("Success")
                })
                .catch(function (err) {
                    console.log(`Error: ${JSON.stringify(err, null, 2)}`)
                })
        })
        .catch(function (err) {
            if (err) {
                console.log(`Error: ${JSON.stringify(err, null, 2)}`)
                if (err.error === "not_found") {
                    console.log(`URL: ${JSON.stringify(url, null, 2)}`)
                    AdminStickerCampaigns_db.put({
                        _id: "Main",
                        activated: data.activated
                    })
                        .then(function (result) {
                            console.log(`Result: ${JSON.stringify(result, null, 2)}`)
                            res.json("Success")

                        })
                        .catch(function (err) {
                            console.log(`Error: ${JSON.stringify(err, null, 2)}`)
                        })
                } else {
                    console.log(`Error: ${JSON.stringify(err, null, 2)}`)
                }
            }
        })


});

export default router;
