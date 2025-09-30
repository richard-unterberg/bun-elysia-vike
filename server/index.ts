import { Elysia } from 'elysia'
import staticPlugin from '@elysiajs/static'
import { renderPage } from 'vike/server'
import { join } from 'node:path'

import { pickEncoded, resolveDocPath } from './compress/helper'
import { compressionFilesTypes } from './compress/store'
import { compressionFileWalker } from './compress/fileWalker'
import { serveEncoded } from './compress/serveEncoded'

const ROOT = join(process.cwd(), 'dist', 'client')

const app = new Elysia()
  .use(
    staticPlugin({
      assets: ROOT,
      prefix: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  )
  .get('*', async ({ request }) => {
    const url = new URL(request.url)
    const pageContext = await renderPage({ urlOriginal: url.pathname + url.search })
    const httpResponse = pageContext.httpResponse
    if (!httpResponse) return new Response('Not Found', { status: 404 })
    const { statusCode, headers, body } = httpResponse
    return new Response(body, { status: statusCode, headers: Object.fromEntries(headers) })
  })

const port = Number(process.env.PORT || 3000)

// collect precompressed files
await compressionFileWalker(ROOT)

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url)
    const acceptEncoding = req.headers.get("accept-encoding") ?? ""

    // static assets
    if (url.pathname.startsWith('/assets/')) {
      const res = await serveEncoded(url.pathname, {
        acceptEncoding: acceptEncoding,
        root: ROOT,
        cache: 'public, max-age=31536000, immutable',
        typeFor: (orig) => compressionFilesTypes.get(orig),
        pick: (p, enc) => pickEncoded(p, enc),
      })
      if (res) return res
    }

    // *.pageContext.json
    if (url.pathname.endsWith('.pageContext.json')) {
      const res = await serveEncoded(url.pathname, {
        acceptEncoding: acceptEncoding,
        root: ROOT,
        cache: 'public, max-age=300',
        typeFor: () => 'application/json; charset=utf-8',
        pick: (p, enc) => pickEncoded(p, enc),
      })
      if (res) return res
    }

    // HTML docs (/, /about, /about.html, /about/index.html)
    {
      const candidates = resolveDocPath(url.pathname) // returns string[]
      const res = await serveEncoded(candidates, {
        acceptEncoding: acceptEncoding,
        root: ROOT,
        cache: 'public, max-age=300',
        typeFor: () => 'text/html; charset=utf-8',
        pick: (p, enc) => pickEncoded(p, enc),
      })
      if (res) return res
    }

    // return to Elysia / Vike SSR
    return app.handle(req)
  },
})

console.log(`➡️ Elysia + Vike on http://localhost:${port}`)
