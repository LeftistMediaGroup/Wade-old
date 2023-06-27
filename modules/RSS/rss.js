// Allow require
import { createRequire } from "module";

//End require
const require = createRequire(import.meta.url);

var PouchDB = require("pouchdb");

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
      `https://${process.env.host}:${process.env.port}/database/rss`
    );

    RSS_db.info().then(function (info) {
      console.log(`RSS From Database: ${JSON.stringify(info)}`);

      console.log(`Refreshing RSS feed \n`);

      feeder.add({
        url: [
          "https://www.reddit.com/.rss",
          "https://theanarchistlibrary.org/feed",
          "https://itsgoingdown.org/feed",
          "https://freedomnews.org.uk/feed",
          "https://anarchistnews.org/rss.xml",
        ],
        refresh: 2000,
      });

      function newItem(feeder, info) {
        feeder.on("new-item", function (item) {
          let exists = Object.values(info).includes(item.title);

          if (exists === false) {
            try {
              RSS_db.put({
                _id: item.title,
                body: { item },
              }).catch((err) => {
                console.log(`Error: ${err}`);
              });
            } catch (err) {
              console.log(`Error: ${err}`);
            }

            console.log(`Item Inserted: ${item.title}\n`);
          } else {
            console.log(`Item Found: ${item.title}\n`);
          }
        });
      }

      newItem(feeder, info);

      feeder.on("error", console.error);

      //feeder.list;
    });
  }
}
