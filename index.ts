import cors from 'cors';
import { CronJob } from 'cron';
import express from 'express';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { rm } from 'fs/promises';
import { basename, dirname, extname, join, resolve } from 'path';
import seedrandom from 'seedrandom';
import sharp from 'sharp';

import { PhotoData, ServerStatus, PORT as port } from './src/types';

const PORT = Number(process.env.PORT || port);
const serverTime = Date.now();

const size = 1200;
const extensions = /\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/i;

const appDir = resolve(__dirname, 'dist');
const tmpDir = resolve(process.env.TMP_DIR || '/tmp/', 'photo-frame');
const photoDir = resolve(process.env.PHOTO_DIR || 'photos/');
mkdirSync(tmpDir, { recursive: true });

let shuffledPhotos: PhotoData[] = [];

// Run resize job every hour
new CronJob('0 30 * * * *', resizePhotos).start();

const app = express();
app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log({ PORT, tmpDir, photoDir, size, extensions });

  // Run resize job on startup. Done after initial logging, but data will be incomplete until it is done.
  resizePhotos();
});

app.use(cors());
app.use(express.static(appDir));
app.use('/img', express.static(tmpDir));

app.get('/photos', async (_req, res) => {
  const files = readdirSync(tmpDir, { recursive: true }).filter((f) => extname(f.toString()).match(extensions));
  const data: PhotoData[] = [];

  for (const f of files) {
    try {
      const meta = await sharp(join(tmpDir, f.toString())).metadata();
      data.push({ url: `/img/${f}`, width: meta.width || 0, height: meta.height || 0 });
    } catch (err) {
      console.error('Error reading metadata:', err);
    }
  }

  // remove photos that are not in the tmp dir
  shuffledPhotos = shuffledPhotos.filter((p) => data.some((d) => d.url === p.url));

  // determine new photos
  const newPhotos = data.filter((p) => !shuffledPhotos.some((s) => s.url === p.url));

  // shuffle new photos and append to the existing array
  shuffledPhotos = stableShuffle(shuffledPhotos, newPhotos, serverTime.toString());

  res.json({ photos: shuffledPhotos });
});

app.post('/refresh', async (req, res) => {
  try {
    await resizePhotos();
    res.status(200).send();
  } catch (err) {
    console.error('Error resizing photos:', err);
    res.status(500).send(err.message);
  }
});

app.get('/status', (_req, res) => {
  const status: ServerStatus = { serverTime, port: PORT };
  res.json(status);
});

// Functions
async function resizePhotos() {
  try {
    console.log(`\nResizing photos in ${photoDir}`);

    const files = readdirSync(photoDir, { recursive: true })
      .map((f) => join(photoDir, f))
      .filter((f) => extname(f).match(extensions));

    console.log('Found', files.length, 'files');

    // remove tmp files that don't match new files
    const tmpFiles = readdirSync(tmpDir, { recursive: true }).map((f) => join(tmpDir, f));

    const finalFiles: string[] = [];

    let resized = 0;
    for (const f of files) {
      try {
        let dir = basename(dirname(f));
        if (dir === 'photos') dir = '';
        else dir = dir + '_';

        const tmpFile = join(tmpDir, dir + basename(f));
        finalFiles.push(tmpFile);

        if (!existsSync(tmpFile)) {
          process.stdout.write('.');

          await sharp(f).resize(size, size, { fit: 'inside' }).jpeg({ quality: 75 }).toFile(tmpFile);
          resized++;
        }
      } catch (e) {
        console.error(`Error resizing ${f}: ${e.message}`);
      }
    }

    if (resized > 0) process.stdout.write('\n');
    console.log(`Resized ${resized} photos`);

    console.log('Cleaning up tmp dir');

    // remove tmp files that are not in the final files
    for (const tmpFile of tmpFiles) {
      if (!finalFiles.includes(tmpFile)) {
        try {
          process.stdout.write('x');
          await rm(tmpFile);
        } catch (e) {
          console.error(`Error removing ${tmpFile}: ${e.message}`);
        }
      }
    }

    console.log();
  } catch (err) {
    console.error('Error resizing photos:', err);
  }
}

// From chatgpt
function stableShuffle(existingArray, newItems, seed) {
  const rng = seedrandom(seed);
  const shuffledNewItems = [...newItems].sort(() => rng() - 0.5);

  let combined = [...existingArray, ...shuffledNewItems];
  return combined;
}
