import type { Config } from "vike/types"
import vikeReact from "vike-react/config"

export default {
  title: "bun meets vike",
  clientRouting: true,
  extends: [vikeReact],
} satisfies Config