import { join } from 'node:path'

type EncodedHit = { file: string; enc?: 'br' | 'gzip' }

// string or array of candidate *original* paths (e.g. "/index.html")
type CandidateInput = string | string[]

interface ServeOpts {
  acceptEncoding: string
  root: string
  cache: string
  typeFor?: (original: string) => string | undefined
  pick: (pathname: string, acceptEncoding: string) => EncodedHit | null
}

/**
 * Try to serve one or many candidate originals with .br → .gz → raw preference.
 * Returns a Response if any candidate exists, else null.
 */
export async function serveEncoded(
  candidate: CandidateInput,
  opts: ServeOpts
): Promise<Response | null> {
  const { acceptEncoding: ae, root, cache, typeFor, pick } = opts
  const list = Array.isArray(candidate) ? candidate : [candidate]

  for (const original of list) {
    const hit = pick(original, ae)
    if (!hit) continue

    const file = Bun.file(join(root, hit.file))
    // ensure file actually exists on disk if you didn't pre-index with a Set
    // (omit this stat if you already did an existence check in `pick`)
    // await stat(join(root, hit.file))

    const res = new Response(file)
    res.headers.set('Vary', 'Accept-Encoding')
    res.headers.set('Cache-Control', cache)
    if (hit.enc) res.headers.set('Content-Encoding', hit.enc)

    const t =
      typeFor?.(original) ||
      (original.endsWith('.js') ? 'text/javascript; charset=utf-8'
        : original.endsWith('.css') ? 'text/css; charset=utf-8'
          : original.endsWith('.svg') ? 'image/svg+xml'
            : original.endsWith('.json') ? 'application/json; charset=utf-8'
              : original.endsWith('.html') ? 'text/html; charset=utf-8'
                : file.type)

    if (t) res.headers.set('Content-Type', t)
    return res
  }
  return null
}
