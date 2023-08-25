// Allow require
import { createRequire } from "module";

import express from "express";
import * as evs from "express-video-stream"; // Express Video Stream

const require = createRequire(import.meta.url);

const fs = require("fs");
const path = require("path");

var router = express.Router();

router.get("/all", (req, res) => {
  let list = router.stack;

  let books = []
  for (let url of list) {
    books.push(url.route.path);
  }

  res.json(books);
});

router.get("/hello", (req, res) => {
  res.json("Hello");
});

export default router;
