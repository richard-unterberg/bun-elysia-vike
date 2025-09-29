import type { Config } from "vike/types"
import vikeReact from "vike-react/config"
import vikeServer from 'vike-server/config'

export default {
  title: "bun + elysia + vike-server",
  clientRouting: true,
  extends: [vikeServer, vikeReact],
  server: 'server/index.ts'
} satisfies Config