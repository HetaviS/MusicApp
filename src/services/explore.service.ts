import { Song, Album, User } from "../models";
import { Op } from "sequelize";

interface SearchResult {
  length: number;
  songs: {
    data: any[];
    total: number;
  };
  artists: {
    data: any[];
    total: number;
  };
  albums: {
    data: any[];
    total: number;
  };
}

async function search(searchTerm: string, page: number = 1, limit: number = 10): Promise<SearchResult> {
  try {
    const offset = (page - 1) * limit;

    const [songsResult, artistsResult, albumsResult] = await Promise.all([
      Song.findAndCountAll({
        where: {
          title: {
            [Op.iLike]: `%${searchTerm}%`
          }
        },
        limit,
        offset
      }),
      User.findAndCountAll({
        where: {
          full_name: {
            [Op.iLike]: `%${searchTerm}%`
          },
          is_singer: true
        },
        limit,
        offset
      }),
      Album.findAndCountAll({
        where: {
          title: {
            [Op.iLike]: `%${searchTerm}%`
          }
        },
        limit,
        offset
      })
    ]);

    return {
      length: songsResult.count + artistsResult.count + albumsResult.count,
      songs: {
        data: songsResult.rows.map(song => song.toJSON()),
        total: songsResult.count
      },
      artists: {
        data: artistsResult.rows.map(artist => artist.toJSON()),
        total: artistsResult.count
      },
      albums: {
        data: albumsResult.rows.map(album => album.toJSON()),
        total: albumsResult.count
      }
    };
  } catch (err) {
    throw err;
  }
}

export default{ search};
