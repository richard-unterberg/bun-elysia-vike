import { Elysia } from 'elysia'
import { apply } from 'vike-server/elysia'
import { serve } from 'vike-server/elysia/serve'

function startServer() {
  const app = apply(new Elysia())
  return serve(app, { port: 3003, hostname: '0.0.0.0' })
}
export default startServer()