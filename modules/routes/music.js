// Allow require
import { createRequire } from "module";

import express from 'express';
import  * as evs from 'express-video-stream'; // Express Video Stream


const require = createRequire(import.meta.url);


const fs = require('fs')
const path = require('path')



var router = express.Router();

router.get('/', (req, res) => { 
    
});

export default router;
