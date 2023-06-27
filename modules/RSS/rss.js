import Parser from "rss-parser";
let parser = new Parser();

async function RefreshFeed() {
  console.log(`Refreshing RSS feed`);

  let feed = await parser.parseURL("https://www.reddit.com/.rss");
  
  console.log(`Feed: ${feed.title} Refreshed`);
}

export default function startRSS(){
    RefreshFeed();
}