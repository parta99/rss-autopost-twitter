const Twitter = require("twitter");
const dotenv = require("dotenv");
const Parser = require("rss-parser");
dotenv.config();

const parser = new Parser();
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

const maxPosts = 5; // maksimal artikel yang akan diposting
const rssUrls = [
  "https://news.google.com/rss/search?hl=en-US&gl=US&q=bali&um=1&ie=UTF-8&ceid=US:en",
  "https://news.google.com/rss/search?hl=en-US&gl=US&q=malware&um=1&ie=UTF-8&ceid=US:en",
];

const postedLinks = []; // array untuk menyimpan URL artikel yang sudah diposting

(async () => {
  for (const rssUrl of rssUrls) {
    let feed = await parser.parseURL(rssUrl);

    for (const item of feed.items.slice().reverse()) {
      if (postedLinks.includes(item.link)) {
        // Jika artikel sudah diposting, lanjut ke item berikutnya
        continue;
      }

      const postDate = Date.parse(item.pubDate);
      const timeSincePost = timeDiff(postDate);
      const status = `${timeSincePost} "${item.title}". ${item.link}`;

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

      postedLinks.push(item.link); // tambahkan URL artikel ke dalam array postedLinks

      if (postedLinks.length >= maxPosts) {
        // Jika sudah mencapai jumlah maksimal artikel yang akan diposting, keluar dari loop
        break;
      }
    }

    if (postedLinks.length >= maxPosts) {
      // Jika sudah mencapai jumlah maksimal artikel yang akan diposting, keluar dari loop
      break;
    }
  }
})();
