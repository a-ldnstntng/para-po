import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(typeAndData), 0);

    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon drawer: Brand Midnight Charcoal (#0F172A), Amber Border/Vehicle Graphic (#D97706), White text area
function drawTransitIcon(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Background: Deep Charcoal (#0F172A)
  let r = 15, g = 23, b = 42, a = 255;

  // Amber Border Frame (#D97706)
  const borderWidth = 0.04;
  if (
    (nx >= borderWidth && nx <= borderWidth + 0.02 && ny >= borderWidth && ny <= 1 - borderWidth) ||
    (nx >= 1 - borderWidth - 0.02 && nx <= 1 - borderWidth && ny >= borderWidth && ny <= 1 - borderWidth) ||
    (ny >= borderWidth && ny <= borderWidth + 0.02 && nx >= borderWidth && nx <= 1 - borderWidth) ||
    (ny >= 1 - borderWidth - 0.02 && ny <= 1 - borderWidth && nx >= borderWidth && nx <= 1 - borderWidth)
  ) {
    return [217, 119, 6, 255];
  }

  // Central Transit Pass Silhouette (White Card in center)
  if (nx >= 0.22 && nx <= 0.78 && ny >= 0.25 && ny <= 0.65) {
    // Bus windshield (Dark Navy)
    if (nx >= 0.28 && nx <= 0.72 && ny >= 0.29 && ny <= 0.42) {
      return [15, 23, 42, 255];
    }
    // Signboard (Amber #D97706)
    if (nx >= 0.32 && nx <= 0.68 && ny >= 0.46 && ny <= 0.54) {
      return [217, 119, 6, 255];
    }
    // Headlights (Gold #F59E0B)
    if (
      ((nx - 0.32) ** 2 + (ny - 0.59) ** 2 < 0.0009) ||
      ((nx - 0.68) ** 2 + (ny - 0.59) ** 2 < 0.0009)
    ) {
      return [245, 158, 11, 255];
    }
    // Card Body: Clean Crisp White (#F8FAFC)
    return [248, 250, 252, 255];
  }

  // Accent Text Bar below (#D97706)
  if (nx >= 0.20 && nx <= 0.80 && ny >= 0.75 && ny <= 0.82) {
    return [217, 119, 6, 255];
  }

  return [r, g, b, a];
}

// Generate all required PWA icons
const icon192 = createPNG(192, 192, drawTransitIcon);
const icon512 = createPNG(512, 512, drawTransitIcon);
const iconMaskable = createPNG(512, 512, drawTransitIcon);
const appleTouchIcon = createPNG(180, 180, drawTransitIcon);

fs.writeFileSync('public/icons/icon-192.png', icon192);
fs.writeFileSync('public/icons/icon-512.png', icon512);
fs.writeFileSync('public/icons/icon-maskable.png', iconMaskable);
fs.writeFileSync('public/icons/apple-touch-icon.png', appleTouchIcon);

console.log('Successfully generated all PWA icons (192x192, 512x512, maskable, apple-touch-icon)!');
