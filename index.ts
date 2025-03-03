import cors from 'cors';
import { CronJob } from 'cron';
import express from 'express';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { basename, extname, join, resolve } from 'path';
import sharp from 'sharp';

import { PhotoData, ServerStatus, PORT as port } from './src/types';

if (!process.versions.bun) throw 'This server must be run with "bun"';

const PORT = Number(process.env.PORT || port);
const serverTime = Date.now();

const size = 1200;
const extensions = /\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/i;

const appDir = resolve(__dirname, 'dist');
const tmpDir = resolve(process.env.TMP_DIR || '/tmp/', 'photo-frame');
const photoDir = resolve(process.env.PHOTO_DIR || 'photos/');
mkdirSync(tmpDir, { recursive: true });

// Run resize job every hour, as well as on server startup
new CronJob('0 30 * * * *', resizePhotos).start();
await resizePhotos();

const app = express();
app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log({ PORT, tmpDir, photoDir, size, extensions });
});

app.use(cors());
app.use(express.static(appDir));
app.use('/img', express.static(tmpDir));

app.get('/photos', async (_req, res) => {
  const files = readdirSync(tmpDir, { recursive: true });
  const data: PhotoData[] = [];

  for (const f of files) {
    const meta = await sharp(join(tmpDir, f.toString())).metadata();
    data.push({ url: `/img/${f}`, width: meta.width || 0, height: meta.height || 0 });
  }

  res.json({ photos: data });
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
  console.log(`Resizing photos in ${photoDir}`);

  const files = readdirSync(photoDir, { recursive: true })
    .map((f) => join(photoDir, f))
    .filter((f) => extname(f).match(extensions));

  let resized = 0;
  for (const f of files) {
    try {
      const tmpFile = join(tmpDir, basename(f));
      if (!existsSync(tmpFile)) {
        process.stdout.write('.');

        await sharp(f).resize(size, size, { fit: 'inside' }).toFile(tmpFile);
        resized++;
      }
    } catch (e) {
      console.error(`Error resizing ${f}: ${e.message}`);
    }
  }

  if (resized > 0) process.stdout.write('\n');
  console.log(`Resized ${resized} photos`);
}
