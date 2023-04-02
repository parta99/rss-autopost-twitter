const Twitter = require('twitter')
const Jimp = require('jimp')

const T = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

// Get direct messages
T.get('direct_messages/events/list', {}, function(err, data, response) {
  if (err) {
    console.log(err)
    return
  }

  // Iterate through messages
  data.events.forEach(function(event) {
    const message = event.message_create.message_data
    const senderId = event.message_create.sender_id
    const attachment = message.attachment

    // Check if message has attachment
    if (attachment && attachment.type === 'media') {
      // Get image URL
      const imageUrl = attachment.media.media_url_https
      
      // Add watermark to image
      Jimp.read(imageUrl, function(err, image) {
        if (err) {
          console.log(err)
          return
        }
        
        const watermark = 'fsbali88'
        const x = image.bitmap.width - 150
        const y = image.bitmap.height - 50
        // const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
        async function myFunction() {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            // kode lainnya yang menggunakan font

        image.print(font, x, y, watermark)
        }
        // Save image with watermark
        const newImageUrl = process.env.WATERMARK_URL
        image.write(newImageUrl)
        
        // Post tweet with image
        T.post('media/upload', { media_data: image.toString('base64') }, function(err, data, response) {
          if (err) {
            console.log(err)
            return
          }
          
          const mediaIdStr = data.media_id_string
          const params = { status: message.text, media_ids: [mediaIdStr] }
          
          T.post('statuses/update', params, function(err, data, response) {
            if (err) {
              console.log(err)
              return
            }
            
            console.log('Tweet posted!')
          })
        })
      })
    }
  })
})
