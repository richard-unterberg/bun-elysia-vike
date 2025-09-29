import type { MovieDetails } from "./types.ts";

export { filterMovieData }

function filterMovieData(movie: MovieDetails & Record<string, unknown>): MovieDetails {
  const { id, title, release_date, director, producer } = movie
  return { id, title, release_date, director, producer }
}