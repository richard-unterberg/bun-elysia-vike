import { Elysia } from 'elysia'
import staticPlugin from '@elysiajs/static'
import { renderPage } from 'vike/server'

const clientDist = new URL('./dist/client', import.meta.url).pathname
const app = new Elysia()

// Serve built client assets (JS/CSS/fonts/images) from Vite/Vike build
app.use(
  staticPlugin({
    assets: clientDist,
    prefix: '/', // serve at root and allow deep paths
    maxAge: 60 * 60 * 24 * 365 // strong caching for hashed assets
  })
)

// Catch-all SSR handler — let Vike render the page
app.get('*', async ({ request }) => {
  const pageContext = await renderPage({
    urlOriginal: new URL(request.url).pathname + new URL(request.url).search
  })
  const httpResponse = pageContext.httpResponse
  if (!httpResponse) {
    return new Response('Not Found', { status: 404 })
  }

  // Bun supports web streams directly in Response
  const { statusCode, headers, body } = httpResponse
  return new Response(body, {
    status: statusCode,
    headers: Object.fromEntries(headers)
  })
})

const port = Number(process.env.PORT || 3000)

app.listen(port)
console.log(`➡️  Elysia + Vike server running on http://localhost:${port}`)
