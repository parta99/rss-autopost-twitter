// Import dependencies
const Parser = require('rss-parser');
const Twit = require('twit');
require('dotenv').config();

// Set up Twitter client
const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Set up RSS parser
const parser = new Parser();

// Set up function to get and post RSS feed
async function postFeed() {
  try {
    // Parse RSS feed
    const feed = await parser.parseURL('http://news.google.com/news?hl=en&gl=us&q=bali&um=1&ie=UTF-8&output=rss');

    // Loop through items in feed and post to Twitter
    feed.items.forEach(async (item) => {
      // Check if item has already been posted
      const status = await T.get('statuses/user_timeline', { screen_name: 'your_twitter_handle', count: 1 });
      const alreadyPosted = status.data.some((tweet) => tweet.text === item.title);

      // Post to Twitter if item has not already been posted
      if (!alreadyPosted) {
        const tweet = await T.post('statuses/update', { status: item.title + ' ' + item.link });
        console.log('Tweet posted: ' + tweet.data.text);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// Call function to post RSS feed on a schedule (every 30 minutes)
setInterval(postFeed, 30 * 60 * 1000);
