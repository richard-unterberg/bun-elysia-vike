// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { filterMoviesData, getStarWarsMovies, getTitle } from './getStarWarsMovies.ts'

async function data() {
  const movies = await getStarWarsMovies()
  return {
    // We remove data we don't need because the data is passed to the client; we should
    // minimize what is sent over the network.
    movies: filterMoviesData(movies),
    // The page's <title>
    title: getTitle(movies),
  }
}
