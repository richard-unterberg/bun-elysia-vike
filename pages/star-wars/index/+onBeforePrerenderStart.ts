import { filterMovieData } from "../filterMovieData.ts";
import { filterMoviesData, getStarWarsMovies, getTitle } from "./getStarWarsMovies.ts";

export { onBeforePrerenderStart }

const onBeforePrerenderStart = async () => {
  const movies = await getStarWarsMovies()

  return [
    {
      url: '/star-wars',
      // We already provide `pageContext` here so that Vike
      // will *not* have to call the `data()` hook defined
      // above in this file.
      pageContext: {
        data: {
          movies: filterMoviesData(movies),
          title: getTitle(movies),
        },
      },
    },
    ...movies.map((movie) => {
      const url = `/star-wars/${movie.id}`
      return {
        url,
        // Note that we can also provide the `pageContext` of other pages.
        // This means that Vike will not call any
        // `data()` hook and the Star Wars API will be called
        // only once (in this `onBeforePrerenderStart()` hook).
        pageContext: {
          data: {
            movie: filterMovieData(movie),
            title: movie.title,
          },
        },
      }
    }),
  ]
}