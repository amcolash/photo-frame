import { CronJob } from "cron";
import express from "express";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { basename, extname, join, resolve } from "path";
import sharp from "sharp";

if (!process.versions.bun) throw 'This server must be run with "bun"';

const PORT = Number(process.env.PORT || 3000);

const size = 1200;
const extensions = /\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/i;

const tmpDir = resolve(process.env.TMP_DIR || "/tmp/", "photo-frame");
const photoDir = resolve(process.env.PHOTO_DIR || "photos/");
mkdirSync(tmpDir, { recursive: true });

// Run resize job every hour, as well as on server startup
new CronJob("0 30 * * * *", resizePhotos).start();
await resizePhotos();

const app = express();
app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log({ PORT, tmpDir, photoDir, size, extensions });
});

app.use(express.static(tmpDir));

app.get("/photos", (_req, res) => {
  const files = readdirSync(tmpDir, { recursive: true }).map((f) => `/${f}`);
  res.json({ photos: files });
});

app.post("/refresh", async (req, res) => {
  try {
    await resizePhotos();
  } catch (err) {
    console.error("Error resizing photos:", err);
    res.status(500).send(err.message);
  }
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
        process.stdout.write(".");

        await sharp(f).resize(size, size, { fit: "inside" }).toFile(tmpFile);
        resized++;
      }
    } catch (e) {
      console.error(`Error resizing ${f}: ${e.message}`);
    }
  }

  if (resized > 0) process.stdout.write("\n");
  console.log(`Resized ${resized} photos`);
}
