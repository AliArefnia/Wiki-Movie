export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  vote_average: number;
  poster_path: string;
  release_date: string;
}
export interface MovieWithTrailer extends Movie {
  officialTrailerKey: string | null;
}

export interface TrendingMoviesResponse {
  results: Movie[];
}

export interface MoviesByGenre {
  results: Movie[];
}
export interface SimilarMovies extends MoviesByGenre {}
export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export interface MovieGet {
  results: Movie[];
}
export interface MovieListWithTrailer {
  results: MovieWithTrailer[];
}

export interface MovieDetail {
  id: number;
  title: string;
  genre_ids: number[];
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  popularity: number;
  runtime: number;
  overview: string;
  genres: Genre[];
  tagline: string;
}

export interface userData {
  id: string;
  email: string;
  wishList: number[];
}

export interface trailer {
  name: string;
  official: boolean;
  key: string;
  id: string;
  type: string;
}

export interface trailerOfMovie {
  results: trailer[];
}
