const fs = require('fs');
const zlib = require('zlib');

function cropPng(inputPath, outputPath) {
  const buf = fs.readFileSync(inputPath);
  let pos = 8;
  let idatChunks = [];
  let width = 0, height = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  let minX = width, maxX = 0, minY = height, maxY = 0;
  let stride = 1 + width * 4;
  for (let y = 0; y < height; y++) {
    let rowStart = y * stride + 1;
    for (let x = 0; x < width; x++) {
      let a = raw[rowStart + x * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add 4px padding
  minX = Math.max(0, minX - 4);
  maxX = Math.min(width - 1, maxX + 4);
  minY = Math.max(0, minY - 4);
  maxY = Math.min(height - 1, maxY + 4);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const croppedRaw = Buffer.alloc(cropH * (1 + cropW * 4));
  let outPos = 0;
  for (let y = minY; y <= maxY; y++) {
    croppedRaw[outPos++] = 0; // Filter byte: None
    let inRow = y * stride + 1 + minX * 4;
    for (let x = 0; x < cropW * 4; x++) {
      croppedRaw[outPos++] = raw[inRow + x];
    }
  }

  const deflated = zlib.deflateSync(croppedRaw);

  function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return ~c;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const res = Buffer.alloc(12 + len);
    res.writeUInt32BE(len, 0);
    res.write(type, 4, 4, 'ascii');
    data.copy(res, 8);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    res.writeInt32BE(crc32(typeAndData), 8 + len);
    return res;
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(cropW, 0);
  ihdrData.writeUInt32BE(cropH, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const outPng = Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, outPng);
  console.log('Cropped', inputPath, '->', outputPath, cropW + 'x' + cropH);
}

cropPng('public/assets/03_LEFT_TROPHY.png', 'public/assets/trophy_03_left.png');
cropPng('public/assets/04_CENTER_TROPHY.png', 'public/assets/trophy_04_center.png');
cropPng('public/assets/05_RIGHT_TROPHY.png', 'public/assets/trophy_05_right.png');
