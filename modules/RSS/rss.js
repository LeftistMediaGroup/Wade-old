// Allow require
import { createRequire } from "module";

//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

import Parser from "rss-parser";
let parser = new Parser({
  defaultRSS: 2.0,
  xml2js: {
    emptyTag: "--EMPTY--",
  },
});

async function RefreshFeed() {
  console.log(`Refreshing RSS feed \n`);

  let feedSourceList = [
    {
      name: "Reddit",
      url: "https://www.reddit.com/.rss",
    },
    {
      name: "The Anarchist Library",
      url: "theanarchistlibrary.org/feed.rss",
    },
  ];

  let feed = { body: {} };

  feedSourceList.forEach(async (item) => {
    let body = { name: "Not Loaded", url: "Not Loaded" };

    try {
      body = await parser.parseURL(item.url);
    } catch (err) {
      console.log(`Error, Could not load: ${item.name}`);
    }

    if (typeof body.title !== "undefined") {
      console.log(`Loaded: ${JSON.stringify(body.title)}`);
    }

    feed.body[item.name] = JSON.parse(JSON.stringify(body));
  });
}

function getFeed() {
  var RSS_db = new PouchDB(
    `https://${process.env.host}:${process.env.port}/database/rss`
  );
  RSS_db.info().then(function (info) {
    console.log(`RSS From Database: ${JSON.stringify(info)}`);
  });
}

export default async function startRSS() {
  console.log(`Starting RSS Server`);
  await RefreshFeed();
}
