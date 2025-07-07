import { Genre, Song } from "../models";
import { IGenre } from "../types";

interface PaginatedGenresResult {
  data: IGenre[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function getAllGenres(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedGenresResult> {
  try {
    const offset = (page - 1) * pageSize;

    const { rows: genres, count: total } = await Genre.findAndCountAll({
      where: { is_deleted: false },
      limit: pageSize,
      offset,
    });

    return {
      data: genres.map(genre => genre.toJSON()),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    throw err;
  }
}

async function createGenre(genrePayload: Partial<IGenre>): Promise<IGenre | null> {
    try {
        const genre = await Genre.create(genrePayload);
        return genre.toJSON();
    } catch (err) {
        throw err;
    }
}

async function updateGenre(genreId: number, genrePayload: Partial<IGenre>): Promise<IGenre | null> {
    try {
        const genre = await Genre.findByPk(genreId);
        if (!genre) return null;
        await genre.update(genrePayload);
        return genre.toJSON();
    } catch (err) {
        throw err;
    }
}

async function removeGenre(genreId: number): Promise<number> {
    try {
        const result = await Genre.update({is_deleted:true},{ where: { genre_id: genreId } });
        return result[0];
    } catch (err) {
        throw err;
    }
}

interface PaginatedSongsResult {
  data: IGenre[]; // or ISong[] if you're using a different interface
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function getSongsByGenre(
  genreId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedSongsResult> {
  try {
    const offset = (page - 1) * pageSize;

    const { rows: songs, count: total } = await Song.findAndCountAll({
      where: { genre_id: genreId },
      limit: pageSize,
      offset
    });

    return {
      data: songs.map(song => song.toJSON()),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (err) {
    throw err;
  }
}

async function getGenreById(genreId: number): Promise<IGenre | null> {
  try {
    const genre = await Genre.findByPk(genreId);
    return genre ? genre.toJSON() as IGenre : null;
  } catch (err) {
    throw err;
  }
}

export default {
    getAllGenres,
    createGenre,
    removeGenre,
    getSongsByGenre,
  getGenreById,
  updateGenre
};