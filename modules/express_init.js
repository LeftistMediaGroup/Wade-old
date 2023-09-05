// Allow require
import { createRequire } from "module";

import * as dotenv from "dotenv";

import System from "./routes/system.js";
import Calendar from "./routes/calendar.js";
import Music from "./routes/music.js";
import Sync from "./routes/sync.js";
import RSS from "./routes/rss.js";
import Library from "./routes/library.js";

import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
var cookieSession = require("cookie-session");

var path = require("path");
var fs = require("fs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const session = require("express-session");
var logger = require("morgan");
var cors = require("cors");
var FileStore = require("session-file-store")(session);

const evs = require("express-video-stream"); // Express Video Stream

var privateKey = fs.readFileSync("./ssl/wade_key.pem");
var certificate = fs.readFileSync("./ssl/wade_cert.pem");

var credentials = { key: privateKey, cert: certificate };

var http = require("http");
var https = require("https");
var PouchDB = require("pouchdb");
var Auth = require("pouchdb-auth");
PouchDB.plugin(Auth);

dotenv.config();

export function Express_Init_Start() {
  var PouchDB = require("pouchdb");

  var express = require("express");
  var app = express();

  app.use(
    cors({
      origin: "https://leftistmediagroup.org",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      headers:
        "Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept",
      credentials: true,
    })
  );

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "none", maxAge: 86400000, httpOnly: false }
  }))

  app.use(cookieParser());

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.use(express.json());

  app.use(logger("dev"));
  app.use(express.urlencoded({ extended: false }));

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");

  app.use(
    "/database",
    require("express-pouchdb")(
      PouchDB.defaults({
        prefix: "./database/",
        skip_setup: true,
      })
    )
  );

  var data = new PouchDB("data", {
    prefix: "./database/",
  });

  app.use(
    "/sync",
    require("express-pouchdb")(
      PouchDB.defaults({
        prefix: "./database/",
      })
    )
  );

  app.use(
    "/rss",
    require("express-pouchdb")(
      PouchDB.defaults({
        prefix: "./database/",
      })
    )
  );

  app.disable("etag");

  app.use("/system", System);
  app.use("/calendar", Calendar);
  app.use("/music", Music);
  app.use("/syncIn", Sync);
  app.use("/rss_out", RSS);
  app.use("/library", Library);

  app.use(express.static("public"));

  evs.setConfig(JSON.parse(fs.readFileSync("./evsConfig.json"))); //Load config from file

  app.use(evs.middleware); //Use streaming middleware

  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  let port = 3001;

  var httpServer = http.createServer(app);

  httpServer.listen(port, () => {
    console.log(`Express server listening on port ${port}\n`);
  });

  //app.listen(port);
  //console.log(`Server listening on port: ${port}\n`);

  return true;
}
