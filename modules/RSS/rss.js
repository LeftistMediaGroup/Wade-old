// Allow require
import { createRequire } from "module";

//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

import Parser from "rss-parser";
let parser = new Parser();

async function RefreshFeed() {
  console.log(`Refreshing RSS feed \n`);

  let feed = await parser.parseURL("https://www.reddit.com/.rss");

  console.log(`Refreshed Feed:\n ${feed.title} \n`);
}

function getFeed() {
  var RSS_db = new PouchDB(
    `https://${process.env.host}:${process.env.port}/database/rss`
  );
  RSS_db.info().then(function (info) {
    console.log(`RSS From Database: ${JSON.stringify(info)}`);
  });
}

export default function startRSS() {
  console.log(`Starting RSS Server`);
  RefreshFeed();
}
