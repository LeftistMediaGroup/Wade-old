// Allow require
import { createRequire } from "module";
import express from 'express';
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')
var PouchDB = require("pouchdb");


var router = express.Router();

const multer = require('multer')

const upload = multer({ dest: 'tmp/' })

/*
router.post('/add_sticker', upload.single('EatAss'), function (req, res) {
    var body = req.body;
    console.log(`Body: ${JSON.stringify(body, null, 2)}`);

    var file = req.file;
    console.log(`File: ${JSON.stringify(file, null, 2)}`);
    console.log(`File Type: ${JSON.stringify(file.mimetype, null, 2)}`);


    var data = fs.readFileSync(file.path);
    console.log(`Data: ${data}`);

    let buffer = Buffer.from(data);
    console.log(`Buffer: ${buffer}`);



    var stickers_db = new PouchDB(
        `https://${process.env.host}/database/AdminStickers`
    );

    stickers_db.info().then(function () {
        stickers_db.put({
            _id: 'EatAss',
            _attachments: {
                'EatAss.png': {
                    content_type: 'image/png',
                    data: data
                }

            }
        }).then(function (result) {
            console.log(`Result: ${JSON.stringify(result, null, 2)}`);
        }).catch((err) => {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
        })
    })

    res.json({
        status: "success"
    });

})
*/


router.get('/get_stickers', (req, res) => {
    var stickers_db = new PouchDB(
        `https://${process.env.host}/database/AdminStickers`
    );

    stickers_db.info().then(function () {
        stickers_db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            console.log(`Get Stickers: ${JSON.stringify(result, null, 2)}`);
        }).catch((err) => {
            console.log(`Error: ${err}`)
        });
    });

    res.json({
        status: "success"
    });

});
export default router;
