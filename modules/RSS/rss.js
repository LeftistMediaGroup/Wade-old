// Allow require
import { createRequire } from "module";

//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

const RssFeedEmitter = require("rss-feed-emitter");
const feeder = new RssFeedEmitter();

async function RefreshFeed() {
  console.log(`Refreshing RSS feed \n`);

  feeder.add({
    url: ["https://www.reddit.com/.rss", "https://theanarchistlibrary.org/feed"],
    refresh: 2000,
  });

  feeder.on("new-item", function (item) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  });

  feeder.on("error", console.error);

  //feeder.list;
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
