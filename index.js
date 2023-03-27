const Parser = require('rss-parser');
const Twitter = require('twitter');
const CronJob = require('cron').CronJob;
const dotenv = require('dotenv');

// const fs = require('fs');
// const config = JSON.parse(fs.readFileSync('config.json'));
// const rssUrl = config.rssUrl;
const rssUrl = 'http://news.google.com/news?hl=en&gl=us&q=bali&um=1&ie=UTF-8&output=rss';


// Konfigurasi dotenv
dotenv.config();

// Konfigurasi parser RSS
const parser = new Parser();

// Konfigurasi client Twitter
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Fungsi untuk mengambil data dari RSS feed
async function getFeedData(url) {
  let feed = await parser.parseURL(url);
  return feed.items;
}
getFeedData(rssUrl)
  .then(items => {
    console.log(items);
  })
  .catch(error => {
    console.log(error);
  });

// Fungsi untuk mengirim tweet ke Twitter
function postTweet(text) {
  client.post('statuses/update', {status: text}, function(error, tweet, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(tweet);
    }
  });
}

// Fungsi untuk menjalankan auto post
async function runAutoPost() {
  try {
    // Ambil data dari RSS feed
    const items = await getFeedData(process.env.RSS_FEED_URL);

    // Kirim tweet untuk setiap item pada RSS feed
    items.forEach((item) => {
      let tweet = item.title + ' ' + item.link;
      postTweet(tweet);
    });
  } catch (error) {
    console.log(error);
  }
}

// Jalankan auto post pada interval tertentu menggunakan CronJob
const job = new CronJob(process.env.CRON_INTERVAL, function() {
  runAutoPost();
}, null, true, process.env.TIMEZONE);

job.start();
