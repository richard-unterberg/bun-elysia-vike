import type { Config } from "vike/types"
import vikeReact from "vike-react/config"

export default {
  title: "bun + elysia + vike-react",
  clientRouting: true,
  extends: [vikeReact],
  prerender: true
} satisfies Config