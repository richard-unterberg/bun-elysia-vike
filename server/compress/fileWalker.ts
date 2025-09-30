import { readdir, stat } from "node:fs/promises"
import { join } from 'node:path'
import { compressionFiles, compressionFilesTypes } from "./store"

function contentType(p: string) {
  if (p.endsWith(".js")) return "text/javascript; charset=utf-8"
  if (p.endsWith(".css")) return "text/css; charset=utf-8"
  if (p.endsWith(".svg")) return "image/svg+xml"
  if (p.endsWith(".json")) return "application/json; charset=utf-8"
  if (p.endsWith(".html")) return "text/html; charset=utf-8"
  return ""
}

export async function compressionFileWalker(dir: string, rel = ""): Promise<void> {
  for (const name of await readdir(dir)) {
    const abs = join(dir, name)
    const r = rel ? `${rel}/${name}` : name
    const s = await stat(abs)
    if (s.isDirectory()) await compressionFileWalker(abs, r)
    else {
      compressionFiles.add(`/${r}`)
      const t = contentType(r)
      if (t) compressionFilesTypes.set(`/${r}`, t)
    }
  }
}