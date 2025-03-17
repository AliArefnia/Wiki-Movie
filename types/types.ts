export interface Movie {
  id: number;
  title: string;
  genre_ids: number[] | number;
  vote_average: number;
  poster_path: string;
  release_date: string;
}

export interface TrendingMoviesResponse {
  results: Movie[];
}

export interface MoviesByGenre {
  results: Movie[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}
