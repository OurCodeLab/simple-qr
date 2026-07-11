const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.join(__dirname, '..', 'public', 'img');

async function walk(dir, fileList = []) {
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      await walk(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

function isBitmapImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
}

async function convert(file) {
  try {
    const dir = path.dirname(file);
    const base = path.basename(file, path.extname(file));
    const webpPath = path.join(dir, base + '.webp');
    const avifPath = path.join(dir, base + '.avif');

    const input = fs.createReadStream(file);
    const image = sharp();
    const buffer = await streamToBuffer(input.pipe(image));

    // WebP
    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(webpPath);

    // AVIF (smaller, slower)
    await sharp(buffer)
      .avif({ quality: 60 })
      .toFile(avifPath);

    console.log('Converted:', path.relative(IMG_DIR, file));
  } catch (err) {
    console.error('Failed converting', file, err.message || err);
  }
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (c) => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) {
    console.error('Image directory not found:', IMG_DIR);
    process.exit(1);
  }

  const files = await walk(IMG_DIR);
  const images = files.filter(isBitmapImage);
  if (!images.length) {
    console.log('No JPG/PNG images found in public/img');
    return;
  }

  for (const img of images) {
    // skip if outputs already exist and are newer than source
    const dir = path.dirname(img);
    const base = path.basename(img, path.extname(img));
    const webp = path.join(dir, base + '.webp');
    const avif = path.join(dir, base + '.avif');

    const srcStat = await fs.promises.stat(img);
    let skip = false;
    if (fs.existsSync(webp) && fs.existsSync(avif)) {
      const webpStat = await fs.promises.stat(webp);
      const avifStat = await fs.promises.stat(avif);
      if (webpStat.mtimeMs >= srcStat.mtimeMs && avifStat.mtimeMs >= srcStat.mtimeMs) {
        skip = true;
      }
    }

    if (!skip) await convert(img);
    else console.log('Up-to-date, skipping:', path.relative(IMG_DIR, img));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
