// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);


var express = require('express');
var router = express.Router();
  

router.get('/register', (req, res) => {

  Database(req.body.username, req.body.password);

  res.json({
    "status": "Success",
    "Username": username
  });
});

export default router;

