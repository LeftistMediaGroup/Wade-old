// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//End require

var path = require("path");
var fs = require("fs");
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import express from 'express';
import http from 'http';
import https from 'https';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import sharedsession from 'express-socket.io-session';
import session from 'express-session';
import FileStore from 'session-file-store';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';
import PouchDB from 'pouchdb';
import Auth from 'pouchdb-auth';
import serveIndex from 'serve-index';


import System from "./routes/system.js";
import Calendar from "./routes/calendar.js";
import Sync from "./routes/sync.js";
import RSS from "./routes/rss.js";
import Library from "./routes/library.js";
import Admin from "./routes/admin.js";
import MoodChart from "./routes/MoodChart.js";
import Chat from "./routes/Chat/Chat.js";
import Contacts from "./routes/Chat/Contacts.js";
import Tasks from "./routes/tasks.js";
import Socket from "./Socket/Socket.js";
import Socials from "./routes/Socials/Socials.js";
import AdminStickers from "./routes/Admin/Stickers.js";
import SundaySocial from "./routes/SundaySocial/SundaySocial.js";
import Music from "./routes/Music/Music.js"

dotenv.config();


export function Express_Init_Start() {
  try {
    const app = express();

    const FileStoreSession = FileStore(session);
    const sessionMiddleware = session({
      secret: "Keyboard_Cat",
      resave: false,
      saveUninitialized: true,
      store: new FileStoreSession(),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 86400000,
        httpOnly: false,
      },
    });

    let corsOptions = {
      origin: "https://localhost:5500",
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders:
        'Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept, Origin, Access-Control-Allow-Credentials',
      credentials: true,
    };
    let corsMiddleware = cors(corsOptions)

    app.use(
      corsMiddleware
    );


    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.json());
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(sessionMiddleware);

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "jade");
    app.use(express.static("public"));
    app.use('/getAdminStickers', express.static('public/AdminStickers'), serveIndex('public/AdminStickers', { 'icons': true }))
    app.use('/adminStickers', express.static('public/AdminStickers'))

    app.use(
      "/database",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
          skip_setup: true,
          view_adapter: "memory"
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
          view_adapter: "memory"
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

    app.use(
      "/users",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
        })
      )
    );

    app.use(
      "/moodchart",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
        })
      )
    );

    app.use(
      "/GPS",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
        })
      )
    );

    app.use(
      "/Social",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
        })
      )
    );

    app.use(
      "/AdminStickerCampaigns",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
        })
      )
    );

    app.use(
      "/Conversations",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
        })
      )
    );

    app.use(
      "/AllMusic",
      require("express-pouchdb")(
        PouchDB.defaults({
          prefix: "./database/",
        })
      )
    );

    app.disable("etag");


    app.use("/system", System);
    app.use("/calendar", Calendar);
    app.use("/syncIn", Sync);
    app.use("/rss_out", RSS);
    app.use("/library", Library);
    app.use("/admin", Admin);
    app.use("/moodchart", MoodChart);
    app.use("/chat", Chat);
    app.use("/contacts", Contacts);
    app.use("/tasks", Tasks);
    app.use("/socials", Socials);
    app.use("/adminStickers", AdminStickers);
    app.use("/SundaySocial", SundaySocial)
    app.use("/music", Music);

    const httpsServer = https.createServer(
      {
        key: fs.readFileSync(`./${process.env.key}`),
        cert: fs.readFileSync(`./${process.env.cert}`),
      },
      app
    );

    const io = new Server(httpsServer, {
      cookie: true,
      cors: corsOptions,
    });

    io.engine.use(sessionMiddleware);

    io.use(sharedsession(sessionMiddleware, { autoSave: true }));


    new Socket(io);


    const port = process.env.port;

    httpsServer.listen(port, () => {
      console.log(`Express server listening on port ${port}\n`);
    });
  } catch (error) {
    console.log(error);
  }

}