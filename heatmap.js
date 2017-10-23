#!/usr/bin/env node
'use strict';

const fs = require('fs');
const readline = require('readline');

var PNG = require('pngjs').PNG;

const width = 2560;
const height = 1440;
const channels = 4;
const increment = 0.01;

const data = new Buffer(width * height * channels).fill(0);
const alpha = new Float32Array(width * height).fill(0);

const lineReader = readline.createInterface({
  input: fs.createReadStream('rectangles.csv')
});

lineReader.on('line', function (line) {
  const coords = line.split(/,\s*/).map(item => parseInt(item));

  for (let y = coords[1]; y < coords[3]; y++) {
    for (let x = coords[0]; x < coords[2]; x++) {
      const alphaPosition = x + (y * width);
      alpha[alphaPosition] += increment;
    }
  }
});

lineReader.on('close', function() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alphaPosition = x + (y * width);
      if (alpha[alphaPosition]) {
        const position = (x * channels) + (y * width * channels);

        // #0073B1 - 0, 115, 177
        data[position] = 0;
        data[position + 1] = 115;
        data[position + 2] = 177;
        data[position + 3] = Math.min(alpha[alphaPosition] * 255, 255);
      }
    }
  }

  const png = new PNG();
  png.width = width;
  png.height = height;
  png.data = data;

  const options = { colorType: 6 };

  const pngData = PNG.sync.write(png, options);
  fs.writeFileSync('heatmap.png', pngData);
});