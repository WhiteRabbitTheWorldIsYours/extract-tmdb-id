export type ExtractTmdbIdParams = {
  imdbId?: string
  title: string
  originalTitle?: string
  year?: number
  language?: string
}
export interface Response {}

export interface Genre {
  id?: number
  name?: string
}

export interface ProductionCompany {
  name?: string
  id?: number
  logo_path?: string
  origin_country?: string
}

export interface ProductionCountry {
  name?: string
  iso_3166_1?: string
}

export interface SpokenLanguage {
  iso_639_1?: string
  name?: string
}

export interface MovieResult {
  poster_path?: string
  adult?: boolean
  overview?: string
  release_date?: string
  genre_ids?: Array<number>
  id?: number
  media_type: 'movie'
  original_title?: string
  original_language?: string
  title?: string
  backdrop_path?: string
  popularity?: number
  vote_count?: number
  video?: boolean
  vote_average?: number
}

export interface MovieResponse extends Response {
  adult?: boolean
  backdrop_path?: string
  belongs_to_collection?: object
  budget?: number
  genres?: Array<Genre>
  homepage?: string
  id?: number
  imdb_id?: string
  original_language?: string
  original_title?: string
  overview?: string
  popularity?: number
  poster_path?: string
  production_companies?: Array<ProductionCompany>
  production_countries?: Array<ProductionCountry>
  release_date?: string
  revenue?: number
  runtime?: number
  spoken_languages?: Array<SpokenLanguage>
  status?: 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled'
  tagline?: string
  title?: string
  video?: boolean
  vote_average?: number
  vote_count?: number
}

export interface PaginatedResponse extends Response {
  page?: number
  total_results?: number
  total_pages?: number
}

export interface MovieResultsResponse extends PaginatedResponse {
  results?: Array<MovieResult>
}