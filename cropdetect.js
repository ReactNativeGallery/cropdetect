const cv = require('opencv4nodejs')
const axios = require('axios')
const gifFrames = require('gif-frames')
const streamToArrayAsync = require('stream-to-array')

const pngPrefix = 'data:image/jpeg;base64,'
const jpgPrefix = 'data:image/png;base64,'
const RATIO_MAX = 0.75
const RATIO_MIN = 0.5

const displayWait = (image) => {
  cv.imshowWait('show', image)
  return this
}

const display = (image) => {
  cv.imshow('show', image)
  return this
}

const filterRectangle = cont => {
  const peri = cont.arcLength(true)
  const approx = cont.approxPolyDP(0.05 * peri, true)
  return approx.length === 4
}

const getCropFromContour = (contour) => {
  const { width, height, x, y } = contour.boundingRect()
  const ratio = Number((width / height).toFixed(4))
  return { width, height, x, y, ratio }
}

const filterRatio = (maxRatio, minRatio) => ({ height, width, ratio }) => {
  return ratio < maxRatio && ratio > minRatio
}

const sortArea = (c1, c2) => c1.area - c2.area

const tap = f => x => {
  f(x);
  return x;
}

exports.decodeFromBase64 = (base64DataString) => {
  const base64Data = base64DataString.replace(pngPrefix, '').replace(jpgPrefix, '')
  return Buffer.from(base64Data, 'base64')
}

exports.cropdetect = (buffer, maxRatio = RATIO_MAX, minRatio = RATIO_MIN) => {
  try {
    const image = cv.imdecode(buffer)
      .cvtColor(cv.COLOR_BGR2GRAY)
      .bilateralFilter(11, 17, 17)
      .canny(10, 250)
      .morphologyEx(
        cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(13, 13)),
        cv.MORPH_CLOSE
      )
      return image
        .findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
        .filter(filterRectangle)
        .sort(sortArea)
        .reverse()
        .slice(0, 10)
        .map(getCropFromContour)
        .filter(filterRatio(maxRatio, minRatio))
        .slice(0, 1)
        .find(() => true)
  } catch (error) {
    console.error('[cropdetect]', error)
    return { error: error.message }
  }
}

const getFirstImageStreamAsync = async (url) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  })
  const frameData =  await gifFrames({
    url: Buffer.from(response.data),
    frames: 0,
    outputType: 'png'
  })
  return frameData[0].getImage()
}

exports.getImageBufferAsync = async (url) => {
  const stream = await getFirstImageStreamAsync(url)
  const parts = await streamToArrayAsync(stream)
  const buffers = parts.map(part => part instanceof Buffer ? part : Buffer.from(part));
  return Buffer.concat(buffers);
}

exports.getFirstImageStreamAsync = getFirstImageStreamAsync