import fetch from "node-fetch";
import {
  ExtractTmdbIdParams,
  MovieResponse,
  MovieResultsResponse,
} from "./types";

const titleMatch = (movieData, needle) =>
  movieData.title.toLowerCase() === needle.toLowerCase() ||
  movieData.original_title.toLowerCase() === needle.toLowerCase();

class TmdbExtractor {
  private tmdbApiKey: string;

  constructor(tmdbApiKey: string) {
    this.tmdbApiKey = tmdbApiKey;
  }

  getById(id: string | number): Promise<number> {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${this.tmdbApiKey}`
    )
      .then((res) => res.json() as Promise<MovieResponse>)
      .then(({ id }) => id || 0)
      .catch(() => 0);
  }

  async getExactByTitleAndMaybeYear(
    title: string,
    year?: number
  ): Promise<number> {
    const results: MovieResultsResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        this.tmdbApiKey
      }&query=${title}&primary_release_year=${year || ""}`
    ).then((res) => res.json() as Promise<MovieResultsResponse>);

    const exactMatch = results.results?.find(
      (res) =>
        (res.title?.toLowerCase() === title.toLowerCase() ||
          res.original_title?.toLowerCase() === title.toLowerCase()) &&
        (year || !res.release_date)
    );
    return exactMatch?.id || 0;
  }

  async getByTitleOnly(title): Promise<number> {
    const byTitle = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbApiKey}&query=${title}`
    ).then((res) => res.json() as Promise<MovieResultsResponse>);
    if (!byTitle) return 0;
    const exactMatch = byTitle.results?.find((res) => titleMatch(res, title));
    return exactMatch?.id || 0;
  }

  async getByTitleAndOriginalTitle(title, originalTitle): Promise<number> {
    const byTitle = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbApiKey}&query=${title}`
    ).then((res) => res.json() as Promise<MovieResultsResponse>);
    const byOriginalTitle = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbApiKey}&query=${originalTitle}`
    ).then((res) => res.json() as Promise<MovieResultsResponse>);
    if (!byTitle || !byOriginalTitle) return 0;
    const exactMatch = byTitle.results?.find(
      (res) =>
        titleMatch(res, title) &&
        byOriginalTitle.results?.find(
          (r) => titleMatch(r, originalTitle) && r.id === res.id
        )
    );
    return exactMatch?.id || 0;
  }

  async extractTmdbId({
    imdbId,
    originalTitle,
    title,
    year,
  }: ExtractTmdbIdParams): Promise<number> {
    let id: number = 0;
    if (imdbId) {
      id = await this.getById(imdbId);
    }
    if (!id && title && year) {
      id = await this.getExactByTitleAndMaybeYear(title, year);
    }
    if (!id && title && year) {
      id = await this.getExactByTitleAndMaybeYear(title, year + 1);
    }
    if (!id && originalTitle) {
      id = await this.getByTitleAndOriginalTitle(title, originalTitle);
    }
    if (!id && title) {
      id = await this.getByTitleOnly(title);
    }
    return id;
  }
}

export default TmdbExtractor;
