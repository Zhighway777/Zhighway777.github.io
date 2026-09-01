import { readdir, mkdir, rm, stat, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("public/personas");
const outputDir = path.resolve("public/personas-optimized");
const manifest = [];
const replaceOriginals = process.argv.includes("--replace");

await mkdir(outputDir, { recursive: true });

const files = (await readdir(sourceDir))
  .filter(file => /\.(jpe?g|png)$/i.test(file))
  .sort();

for (const file of files) {
  const source = path.join(sourceDir, file);
  const target = path.join(outputDir, `${path.basename(file, path.extname(file))}.webp`);

  const pipeline = sharp(source)
    .resize({
      width: 768,
      height: 768,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
      effort: 6,
      smartSubsample: true,
    });

  const info = await pipeline.toFile(target);
  manifest.push({
    source: file,
    output: path.basename(target),
    sourceBytes: (await stat(source)).size,
    outputBytes: info.size,
  });
}

await writeFile(
  path.join(outputDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

if (replaceOriginals) {
  for (const item of manifest) {
    await rm(path.join(sourceDir, item.source), { force: true });
    await rename(
      path.join(outputDir, item.output),
      path.join(sourceDir, item.output),
    );
  }
  await rm(outputDir, { recursive: true, force: true });
}

const totalSource = manifest.reduce((total, item) => total + item.sourceBytes, 0);
const totalOutput = manifest.reduce((total, item) => total + item.outputBytes, 0);
console.log(JSON.stringify({
  images: manifest.length,
  totalSourceBytes: totalSource,
  totalOutputBytes: totalOutput,
  compressionRatio: Number((totalOutput / totalSource).toFixed(4)),
}, null, 2));
