import type { PageContextServer, PageContextClient } from "vike/types";
import type { Data } from "./+data.server.js";

export function title(pageContext: PageContextClient<Data> | PageContextServer<Data>) {
  return pageContext.data.title
}