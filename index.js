const gifFrames = require('gif-frames')
const fs = require('fs')

const { cropdetect } = require('./cropdetect')

(async function main() {
  try {
    const data = fs.readFileSync('./frames/giftedchat.png')
    console.log(cropdetect(data.toString('base64')))
  } catch (error) {
    console.error(error)
  }
})();




