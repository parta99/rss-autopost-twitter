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
    "http://news.google.com/news?hl=en&gl=us&q=bali&um=1&ie=UTF-8&output=rss"
  );

  // Read posted articles from file
  const postedArticles = readPostedArticles();

  // Filter out posted articles
  const unpostedArticles = feed.items.filter(
    (item) => !postedArticles.includes(item.link)
  );

  // Post unposted articles
  for (const item of unpostedArticles) {
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

// Function to calculate time difference
// function timeDiff(pastTime) {
//   const now = new Date().getTime();
//   const diff = now - pastTime;
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((diff % (1000 * 60)) / 1000);
//   if (hours > 0) {
//     return `(${hours}h ${minutes}m ago)`;
//   } else if (minutes > 0) {
//     return `(${minutes}m ${seconds}s ago)`;
//   } else {
//     return `(${seconds}s ago)`;
//   }
// }
