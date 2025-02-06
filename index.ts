import { CronJob } from "cron";
import express from "express";
import { existsSync, mkdir, mkdirSync, readdirSync } from "fs";
import { basename, join, resolve } from "path";
import sharp from "sharp";

const PORT = 3000;

const size = 1200;

const app = express();

const tmpDir = resolve(process.env.TMP_DIR || "/tmp/", "photo-frame");
const photoDir = resolve(process.env.PHOTO_DIR || "photos/");

mkdirSync(tmpDir, { recursive: true });

async function resizePhotos() {
  console.log(`Resizing photos in ${photoDir}`);

  const files = readdirSync(photoDir, { recursive: true }).map((f) => join(photoDir, f));

  let resized = 0;
  for (const f of files) {
    const tmpFile = join(tmpDir, basename(f));
    if (!existsSync(tmpFile)) {
      process.stdout.write(".");

      await sharp(f).resize(size, size, { fit: "inside" }).toFile(tmpFile);
      resized++;
    }
  }

  if (resized > 0) process.stdout.write("\n");
  console.log(`Resized ${resized} photos`);
}

await resizePhotos();

app.listen(PORT, () => console.log(`\nServer is running on port ${PORT}`, { tmpDir, photoDir }));

app.use(express.static(tmpDir));
app.get("/photos", (_req, res) => {
  const files = readdirSync(tmpDir, { recursive: true }).map((f) => `/${f}`);
  res.json({ photos: files });
});
