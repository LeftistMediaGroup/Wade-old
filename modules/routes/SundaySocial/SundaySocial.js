// Allow require
import { createRequire } from "module";
import express from 'express';
import axios from "axios";
import strftime from "strftime";
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')


var router = express.Router();

router.get('/get_SS', (req, res) => {
    axios.post(`${process.env.Chat_URL}/api/v1/meeting`,
        {
            "room": strftime("%y%m%d"),
            "roomPassword": "false",
            "audio": "false",
            "video": "false",
            "screen": "false",
            "notify": "false"
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'DootDoot'
            }
        }).then((result) => {
            console.log(`URL Data Join: ${JSON.stringify(result.data.meeting, null, 2)}`);

            res.json(result.data.meeting);
        })
        .catch((err) => {
            console.log(`Err: ${JSON.stringify(err, null, 2)}`);
        })
});

export default router;
