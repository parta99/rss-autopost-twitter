// untuk posted satu artikel saja
const dotenv = require("dotenv");
const Twitter = require("twitter");
const Parser = require("rss-parser");

dotenv.config();

// get RSS feed
const parser = new Parser();

// Create a Twitter client to manage credentials
const client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

// Generate a random integer, somewhere between 0 and the 'max' value provided
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

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

// Using an IIFE to call teh file, automatically run the function, and move on :)
(async () => {
  let feed = await parser.parseURL("https://news.google.com/rss/search?hl=en-US&gl=US&q=denpasar&um=1&ie=UTF-8&ceid=US:en");

  // Select a post
  const postNumber = getRandomInt(feed.items.length);
  const selectedPost = feed.items[postNumber];

  // Determine what the time stamp is
  const postDate = Date.parse(selectedPost.pubDate);
  const timeSincePost = timeDiff(postDate);
  // Generate and send post
  const postLink = selectedPost.link;
  const status = `${timeSincePost} "${selectedPost.title}". ${postLink}`;

  client.post(
    "status/update",
    {
      status: status,
    },
    function (error, tweet, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(tweet);
      }
    }
  );
})();