// Allow require
import { createRequire } from "module";

//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

const jsonFix = require("json-fixer");
import { jsonrepair } from "jsonrepair";

import strftime from "strftime";
var Chance = require("chance");

var chance = new Chance();

const RssFeedEmitter = require("rss-feed-emitter");
const feeder = new RssFeedEmitter();

export default async function startRSS() {
  console.log(`Starting RSS Server\n`);
  let FeedStore = new feedStore();
}

class feedStore {
  constructor() {
    this.getFeed();
  }

  getFeed() {
    var RSS_db = new PouchDB(
      `http://${process.env.host}:${process.env.port}/database/rss`
    );

    RSS_db.info().then(() => {
      RSS_db.allDocs({
        include_docs: true,
      }).then(function (info) {
        //console.log(`RSS From Database: ${JSON.stringify(info, null, 2)}`);

        console.log(`Refreshing RSS feed \n`);

        feeder.add({
          url: [
            "http://theanarchistlibrary.org/feed",
            "http://itsgoingdown.org/feed",
            "http://freedomnews.org.uk/feed",
            //"http://anarchistnews.org/rss.xml",
          ],
          refresh: 2000,
        });

        function newItem(feeder, info) {
          feeder.on("new-item", function (item) {
            if (JSON.stringify(info).includes(item.title)) {
              let exists = true;
            } else {
              try {
                RSS_db.put({
                  _id: `${strftime("%Y%M%D_%X_%L")}_${chance.string({
                    length: 5,
                  })}`,
                  title: item.title,
                  body: item.description,
                  all: item,
                }).catch((err) => {
                  console.log(`Error: ${JSON.stringify(err, null, 2)}`);
                });
              } catch (err) {
                console.log(`Error: ${JSON.stringify(err, null, 2)}`);
              }
            }
          });
        }

        newItem(feeder, info);

        feeder.on("error", console.error);

        //feeder.list;
      });
    });
  }
}
