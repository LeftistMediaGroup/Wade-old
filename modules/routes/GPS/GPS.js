// Allow require
import { createRequire } from "module";
import express from 'express';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');

var router = express.Router();

router.get('/init_GPS', (req, res) => {
    startGPS(req.session.username);
});

export default router;