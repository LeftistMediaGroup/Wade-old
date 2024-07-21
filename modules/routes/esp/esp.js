// Allow require
import { createRequire } from "module";
import express from 'express';
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')


var router = express.Router();

router.post('/testIn', (req, res) => {
    console.log(req.body)
    res.send('test');
    res.end()
});

export default router;
