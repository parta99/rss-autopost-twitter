const Twitter = require("twitter");
const dotenv = require("dotenv");
const Parser = require("rss-parser");
const fs = require("fs");

dotenv.config();

const parser = new Parser();
const FILENAME = "posted_articles.txt";
const client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

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

  // Memuat daftar URL dari file .env
  // const urls = [
  //   process.env.URL_1,
  //   process.env.URL_2,
  // ];

  const postTweet = async () => {
    try {
      const urls = process.env.RSS_FEED_URLS.split(",");
  
      const posted = fs.existsSync(FILENAME)
        ? JSON.parse(fs.readFileSync(FILENAME))
        : [];
  
      let feedItems = [];
      for (let i = 0; i < urls.length; i++) {
        const feed = await parser.parseURL(urls[i]);
        feedItems = [...feedItems, ...feed.items];
      }
  
      const nonPostedItems = feedItems.filter(
        (item) => !posted.includes(item.guid)
      );
  
      if (nonPostedItems.length > 0) {
        const selectedPost = nonPostedItems[0];
        const postDate = Date.parse(selectedPost.pubDate);
        const timeSincePost = timeDiff(postDate);
  
        const postLink = selectedPost.link;
        const status = `${timeSincePost} "${selectedPost.title}". ${postLink}`;
  
        client.post(
          "statuses/update",
          {
            status: status,
          },
    
          function (error, tweet, response) {
            if (error) {
              console.log(error);
            } else {
              console.log(tweet);
              posted.push(selectedPost.guid);
              fs.writeFileSync(FILENAME, JSON.stringify(posted));
            }
          }
        );
      } else {
        console.log("All articles already posted");
      }
    } catch (error) {
      console.log(error);
    }
  };  
  postTweet();