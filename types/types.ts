export type Movie = {
  id: number;
  media_type: "movie";
  title: string;
  vote_average: number;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
};

export type TvShow = {
  id: number;
  media_type: "tv";
  name: string;
  vote_average: number;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
};

export type Person = {
  id: number;
  media_type: "person";
  name: string;
  profile_path: string | null;
  known_for: {
    id: number;
    title?: string;
    name?: string;
    media_type: string;
    poster_path: string | null;
  }[];
  known_for_department: string;
};

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

export interface TvDetail {
  id: number;
  name: string;
  genre_ids?: number[];
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  popularity: number;
  overview: string;
  number_of_seasons: number;
  genres: Genre[];
  tagline: string;
}

export interface PersonDetail {
  id: number;
  name: string;
  profile_path: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  popularity: number;
  known_for_department: string;
}

export type SearchResult = Movie | TvShow | Person;

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
export interface MultipleSearchGet {
  results: Movie[];
}
export interface MovieListWithTrailer {
  results: MovieWithTrailer[];
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

export interface MovieCastCrew {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface MultiSearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  vote_average?: number;
  poster_path?: string;
  profile_path?: string;
  release_date?: string;
  genre_ids?: number[];
  known_for?: Movie[];
}
