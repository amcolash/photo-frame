import cors from 'cors';
import { CronJob } from 'cron';
import exif from 'exif-reader';
import express from 'express';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { readFile, rm } from 'fs/promises';
import { basename, dirname, extname, join, resolve } from 'path';
import seedrandom from 'seedrandom';
import sharp from 'sharp';

import { PhotoData, PhotoIndex, ServerStatus, PORT as port } from './src/types';

const PORT = Number(process.env.PORT || port);
const serverTime = new Date();
let seed = 0;

const size = 1200;
const extensions = /\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/i;

const appDir = resolve(__dirname, 'dist');
const tmpDir = resolve(process.env.TMP_DIR || '/tmp/', 'photo-frame');
const photoDir = resolve(process.env.PHOTO_DIR || 'photos/');
mkdirSync(tmpDir, { recursive: true });

let shuffledPhotos: PhotoData[] = [];
let resizeProgress: number | undefined = undefined;

// Run resize job every hour
new CronJob('0 30 * * * *', resizePhotos).start();

// Reset shuffled photos every week
new CronJob('0 0 * * 0', () => {
  shuffledPhotos = [];
  seed++;
}).start();

const app = express();
app.listen(PORT, async () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log({ PORT, tmpDir, photoDir, size, extensions });

  // Run resize job on startup. Done after initial logging, but data will be incomplete until it is done.
  await resizePhotos();
  resizeProgress = undefined;
});

app.use(cors());
app.use(express.static(appDir));
app.use('/img', express.static(tmpDir));

app.get('/photos', async (_req, res) => {
  res.json({ photos: shuffledPhotos });
});

app.get('/photo/:index', async (req, res) => {
  if (shuffledPhotos.length === 0) {
    console.error('Error: No photos found');
    res.status(500).send('No photos found');
    return;
  }

  const index = mod(Number(req.params.index), shuffledPhotos.length);
  const prev = mod(index - 1, shuffledPhotos.length);
  const next = mod(index + 1, shuffledPhotos.length);

  const data: PhotoIndex = {
    previous: shuffledPhotos[prev],
    current: shuffledPhotos[index],
    next: shuffledPhotos[next],
    index,
    total: shuffledPhotos.length,
  };

  if (!data.previous || !data.current || !data.next) {
    console.error('Error: Missing photo data', req.params.index, index, prev, next);
    res.status(500).send('Missing photo data');
    return;
  }

  res.json(data);
});

app.post('/refresh', async (req, res) => {
  try {
    await resizePhotos();
    res.status(200).send();
  } catch (err) {
    console.error('Error resizing photos:', err);
    res.status(500).send(err.message);
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    resizeProgress = undefined;
  }
});

app.get('/status', async (_req, res) => {
  const clientTime = await readFile(join(__dirname, 'dist', 'build.json'), 'utf8')
    .then((data) => JSON.parse(data).buildTime)
    .catch(() => 'unknown');

  const status: ServerStatus = {
    serverTime: serverTime.toISOString(),
    clientTime,
    port: PORT,
    numPhotos: shuffledPhotos.length,
    resizeProgress,
  };
  res.json(status);
});

// Functions
async function updateShuffledPhotos() {
  const files = readdirSync(tmpDir, { recursive: true }).filter((f) => extname(f.toString()).match(extensions));
  const data: PhotoData[] = [];

  for (const f of files) {
    try {
      const meta = await sharp(join(tmpDir, f.toString())).metadata();
      const img = { url: `/img/${f}`, width: meta.width || 0, height: meta.height || 0 };

      // if (meta.exif) {
      //   const metadata = exif(meta.exif);

      //   const make = metadata.Image?.Make;
      //   const model = metadata.Image?.Model;
      //   const date = metadata.Image?.DateTime;

      //   console.log(make, model, date);
      // }

      data.push(img);
    } catch (err) {
      console.error('Error reading metadata:', err);
    }
  }

  // remove photos that are not in the tmp dir
  shuffledPhotos = shuffledPhotos.filter((p) => data.some((d) => d.url === p.url));

  // determine new photos
  const newPhotos = data.filter((p) => !shuffledPhotos.some((s) => s.url === p.url));

  // shuffle new photos and append to the existing array
  shuffledPhotos = stableShuffle(shuffledPhotos, newPhotos, serverTime + seed.toString());
  // shuffledPhotos = [...shuffledPhotos, ...newPhotos];
}

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
    resizeProgress = 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        let dir = basename(dirname(f));
        if (dir === 'photos') dir = '';
        else dir = dir + '_';

        const tmpFile = join(tmpDir, dir + basename(f));
        finalFiles.push(tmpFile);

        if (!existsSync(tmpFile)) {
          process.stdout.write('.');

          await sharp(f).keepMetadata().resize(size, size, { fit: 'inside' }).jpeg({ quality: 75 }).toFile(tmpFile);
          resized++;
        }

        resizeProgress = (i + 1) / files.length;
      } catch (e) {
        console.error(`Error resizing ${f}: ${e.message}`);
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    resizeProgress = 0.95;

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

  // After resize, update the shuffled photos
  try {
    await updateShuffledPhotos();
  } catch (err) {
    console.error('Error updating shuffled photos:', err);
  }
}

// From chatgpt
function stableShuffle(existingArray, newItems, seed) {
  const rng = seedrandom(seed);
  const shuffledNewItems = [...newItems].sort(() => rng() - 0.5);

  let combined = [...existingArray, ...shuffledNewItems];
  return combined;
}

// Mod that handles negative numbers
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
