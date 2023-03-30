const Parser = require("rss-parser");
const Twitter = require("twitter");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const parser = new Parser();
const client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// Inspired by: https://www.geeksforgeeks.org/get-the-relative-timestamp-difference-between-dates-in-javascript/
const timeDiff = (prev) => {
  if (!prev) {
    return null;
  }

  const curr = new Date();
  const ms_Min = 60 * 1000; // milliseconds in Minute
  const ms_Hour = ms_Min * 60; // milliseconds in Hour
  const ms_Day = ms_Hour * 24; // milliseconds in day
  const ms_Mon = ms_Day * 30; // milliseconds in Month
  const ms_Yr = ms_Day * 365; // milliseconds in Year
  const diff = curr - prev; // difference between dates.

  // If the diff is less then milliseconds in a minute
  if (diff < ms_Min) {
    return "A few seconds ago";

    // If the diff is less then milliseconds in a Hour
  } else if (diff < ms_Hour) {
    return "A few minutes ago";

    // If the diff is less then milliseconds in a day
  } else if (diff < ms_Day) {
    return "A few hours ago";

    // If the diff is less then milliseconds in a Month
  } else if (diff < ms_Mon) {
    return "A few days ago";

    // If the diff is less then milliseconds in a year
  } else if (diff < ms_Yr) {
    return "A few months ago";
  } else {
    return "A few years ago";
  }
};

const FILENAME = "posted_articles.txt";
const maxPost = 5;

// Function to read posted articles from file
function readPostedArticles() {
  if (fs.existsSync(FILENAME)) {
    const data = fs.readFileSync(FILENAME, "utf8");
    return data.trim().split("\n");
  } else {
    return [];
  }
}

// Function to write posted articles to file
function writePostedArticles(articles) {
  fs.writeFileSync(FILENAME, articles.join("\n"));
}

(async () => {
  let feed = await parser.parseURL(
    "https://news.google.com/rss/search?hl=en-US&gl=US&q=bali&um=1&ie=UTF-8&ceid=US:en"
  );

  // Read posted articles from file
  const postedArticles = readPostedArticles();

  // Filter out posted articles
  const unpostedArticles = feed.items.filter(
    (item) => !postedArticles.includes(item.link)
  );

  // Get maximum unposted articles to post
  const numUnposted = Math.min(maxPost, unpostedArticles.length);


  // Post unposted articles
  // for (const item of unpostedArticles) {
  for (let i = 0; i < numUnposted; i++){
    const item = unpostedArticles[i]; //tambahan
    const postDate = Date.parse(item.pubDate);
    const timeSincePost = timeDiff(postDate);
    const status = `${timeSincePost} "${item.title}". ${item.link}`;

    client.post(
      "statuses/update",
      {
        status: status,
      },
      function (error, tweet, response) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Posted: ${item.link}`);
          // Add posted article to list
          postedArticles.push(item.link);
          // Write posted articles to file
          writePostedArticles(postedArticles);
        }
      }
    );
  }
})();
