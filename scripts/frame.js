#!/usr/bin/env node

const gifFrames = require('gif-frames');
const fs = require('fs');

let [_0, _1, file ] = process.argv;

(async function main() {

  if (file) {
    const frameData = await gifFrames({ url: file, frames: 0, outputType: 'png' });
    frameData[0]
      .getImage()
      .pipe(fs.createWriteStream(`./frames/${file.replace('/', '_').split('.')[0]}.png`));
  } else {
    console.warn('missed one argument with relative path of gif file');
  }
})()

