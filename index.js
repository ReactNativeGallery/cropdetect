const gifFrames = require('gif-frames');
const fs = require('fs');

const { cropdetect } = require('./cropdetect');

(async function main() {
  try {
    const data0 = fs.readFileSync('./frames/0.png')
    console.log(cropdetect(data0.toString('base64')))

    const data1 = fs.readFileSync('./frames/1.png')
    console.log(cropdetect(data1.toString('base64')))

    const data2 = fs.readFileSync('./frames/2.png')
    console.log(cropdetect(data2.toString('base64')))
  } catch (error) {
    console.error(error)
  }
})();