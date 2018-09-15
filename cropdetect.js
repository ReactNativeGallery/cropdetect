const cv = require('opencv4nodejs')

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

const decodeFromBase64 = (base64DataString) => {
  const base64Data = base64DataString.replace(pngPrefix, '').replace(jpgPrefix, '')
  const buffer = Buffer.from(base64Data, 'base64')
  const img = cv.imdecode(buffer)
  return img
}

const filterRectangle = cont => {
  const peri = cont.arcLength(true)
  const approx = cont.approxPolyDP(0.05 * peri, true)
  return approx.length === 4
}

const getCropFromContour = (contour) => {
  const { width, height, x, y } = contour.boundingRect()
  return { width, height, x, y }
}

const filterRatio = (maxRatio, minRatio) => ({ height, width }) => {
  const ratio = width / height
  return ratio < maxRatio && ratio > minRatio
}

const sortArea = (c1, c2) => c1.area - c2.area

const tap = f => x => {
  f(x);
  return x;
}

exports.cropdetect = (base64, maxRatio = RATIO_MAX, minRatio = RATIO_MIN) => {
  try {
    const image = decodeFromBase64(base64)
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
    return { error }
  }
}