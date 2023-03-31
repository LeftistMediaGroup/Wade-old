// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var express = require('express');
var router = express.Router();


router.post('/submit', (req, res) => {
  //Database(req.body.email, req.body.username, req.body.password);

  console.log(req.body.email, req.body.username, req.body.password);
});

router.post('/email_update', (req, res) => {
  //Database(req.body.email);
  
  console.log(req.body.email);
});

export default router;