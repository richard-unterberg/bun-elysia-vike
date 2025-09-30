import { compressionFiles } from "./store";

// tries picking .br → .gz → raw, but only if present in the index
export function pickEncoded(pathname: string, acceptEncoding: string) {
  const br = `${pathname}.br`
  const gz = `${pathname}.gz`
  if (acceptEncoding.includes("br") && compressionFiles.has(br)) return { file: br, enc: "br" as const }
  if (acceptEncoding.includes("gzip") && compressionFiles.has(gz)) return { file: gz, enc: "gzip" as const }
  if (compressionFiles.has(pathname)) return { file: pathname }
  return null
}

/** resolves: `/ -> /index.html`, `/about -> /about.html` or `/about/index.html`  */
export function resolveDocPath(p: string) {
  if (p === "/") return ["/index.html"]
  if (p.endsWith(".html")) return [p]
  if (!/\.[a-z0-9]+$/i.test(p)) return [`${p}.html`, `${p}/index.html`]
  return []
}
