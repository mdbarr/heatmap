#!/usr/bin/env node
'use strict';

const fs = require('fs');

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const width = 2560;
const height = 1440;
const length = width * height * 4;

const minSize = 20;
const maxSize = 50;

const count = 250000;

const outFile = 'rectangles.csv';

const out = fs.openSync(outFile, 'w');

for (let i = 0; i < count; i++) {
  let topLeftX, topLeftY;
  let bottomRightX, bottomRightY;
  let inside = false;

  while(!inside) {
    topLeftX = random(0, width);
    topLeftY = random(0, height);

    bottomRightX = topLeftX + random(minSize, maxSize);
    bottomRightY = topLeftY + random(minSize, maxSize);

    if (bottomRightX < width && bottomRightY < height) {
      inside = true;
    }
  }

  const coords = `${ topLeftX },${ topLeftY },${ bottomRightX },${ bottomRightY }\n`;
  //process.stdout.write(coords);
  fs.writeSync(out, coords);
}


fs.closeSync(out);