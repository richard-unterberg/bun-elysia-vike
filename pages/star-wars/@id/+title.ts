import type { PageContextServer, PageContextClient } from "vike/types";
import type { Data } from "./+data.ts";

export function title(pageContext: PageContextClient<Data> | PageContextServer<Data>) {
  return pageContext.data.title
}