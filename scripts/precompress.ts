import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { brotliCompressSync, constants as z } from "node:zlib";

const ROOT = join(process.cwd(), "dist", "client");
const EXTENSIONS = new Set([".js", ".css", ".html", ".svg", ".json", ".xml", ".txt", ".ttf", ".otf", ".eot", ".woff", ".woff2", ".map"]); // tweak as needed
let compressionFileCount = 0;

async function compressOne(filepath: string) {
  const raw = await Bun.file(filepath).arrayBuffer();
  const u8 = new Uint8Array(raw);

  // --- gzip ---
  const gz = Bun.gzipSync(u8, { level: 9 }); // max compression
  await writeSibling(filepath, gz, `${filepath}.gz`);

  // --- brotli ---
  // q=11 is max; q=5–8 is usually a good build-time tradeoff.
  const br = brotliCompressSync(u8, {
    params: {
      [z.BROTLI_PARAM_QUALITY]: 9,
      [z.BROTLI_PARAM_MODE]: z.BROTLI_MODE_TEXT
    }
  });

  compressionFileCount++;
  await writeSibling(filepath, br, `${filepath}.br`);
}

async function writeSibling(_orig: string, buf: Uint8Array, outPath: string) {
  await mkdir(join(outPath, ".."), { recursive: true });
  await writeFile(outPath, buf);
}

async function walk(dir: string) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p);
    else if (EXTENSIONS.has(p.slice(p.lastIndexOf(".")))) await compressOne(p);
  }
}

const start = Date.now();
await walk(ROOT);
const end = Date.now();
console.log(`Precompression (${compressionFileCount} files) done in ${(end - start) / 1000}s`);
