#!/usr/bin/env node
'use strict';

const fs = require('fs');
const readline = require('readline');

var PNG = require('pngjs').PNG;

const width = 2560;
const height = 1440;
const channels = 4;
const length = width * height * channels;

const increment = 2;

const data = new Uint8Array(length).fill(0);

const lineReader = readline.createInterface({
  input: fs.createReadStream('rectangles.csv')
});

lineReader.on('line', function (line) {
  const coords = line.split(/,\s*/).map(item => parseInt(item));

  for (let y = coords[1]; y < coords[3]; y++) {
    for (let x = coords[0]; x < coords[2]; x++) {
      const position = (x * channels) + (y * width * channels);

      // color set to #0073B1
      // data[position] = 0 is done by the fill
      data[position + 1] = 115;
      data[position + 2] = 177;

      const alpha = data[position + 3];
      data[position + 3] = Math.min(alpha + increment, 255);
    }
  }
});

lineReader.on('close', function() {
  const png = new PNG();
  png.width = width;
  png.height = height;
  png.data = new Buffer(data);

  png.pack().pipe(fs.createWriteStream('out.png'));

  const options = { colorType: 6 };

  const buffer = PNG.sync.write(png, options);
  fs.writeFileSync('heatmap.png', buffer);
});