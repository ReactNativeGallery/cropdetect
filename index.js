const fs = require('fs');
const { cropdetect, getImageBufferAsync, decodeFromBase64, getFirstImageStreamAsync } = require('./cropdetect');

const GIF_URL = 'https://thumbs.gfycat.com/AbsoluteSadDobermanpinscher-size_restricted.gif';

(async function main() {
  try {
    const data0 = fs.readFileSync('./frames/0.png')
    console.log(cropdetect(decodeFromBase64(data0.toString('base64'))))

    const data1 = fs.readFileSync('./frames/1.png')
    console.log(cropdetect(decodeFromBase64(data1.toString('base64'))))

    const data2 = fs.readFileSync('./frames/2.png')
    console.log(cropdetect(decodeFromBase64(data2.toString('base64'))))

    const data3 = fs.readFileSync('./frames/3.png')
    console.log(cropdetect(decodeFromBase64(data3.toString('base64'))))

    const data4 = await getImageBufferAsync(GIF_URL)
    console.log(cropdetect(data4))

    const stream = await getFirstImageStreamAsync(GIF_URL)
    stream.pipe(fs.createWriteStream('./frames/3.png'));

  } catch (error) {
    console.error(error)
  }
})()