import { MusicSinger, Genre, Favourites, User } from "../models";
import { Song } from "../models";
import { ISong } from "../types";

async function addSongToArtist(songId: number, artistId: number) {
    try {
        const songSinger = await MusicSinger.create({ song_id: songId, user_id: artistId });
        if (songSinger) {
            return songSinger
        }
        return null
    } catch (err) {
        throw err;
    }
}

async function addSong(song: Partial<ISong>): Promise<ISong | null> {
    try {
        const newMusic = await Song.create(song);
        if (newMusic) return newMusic.toJSON() as ISong;
        return null
    }
    catch (err) {
        throw err;
    }
}

interface PaginatedMySongsResult {
  data: (ISong & { favourites_count: number })[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function mySongs(
  artistId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedMySongsResult> {
  try {
    const offset = (page - 1) * pageSize;

    const { rows, count: total } = await MusicSinger.findAndCountAll({
      where: { user_id: artistId },
      limit: pageSize,
      offset,
      include: [
        {
          model: Song,
          as: 'song',
          include: [
            {
              model: Genre,
              as: 'genre',
            },
           
          ],
        },
         {
              model: User,
              as: 'singer',
              attributes: ['user_id', 'full_name', 'profile_pic'],
            },
      ],
    });
    const data = await Promise.all(
      rows.map(async (record) => {
        const songData = record.get({ plain: true });
        const favourites_count = await Favourites.count({
          where: { song_id: songData.song.song_id },
        });
        return { singer:songData.singer, ...songData.song, favourites_count };
      })
    );

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    throw err;
  }
}


async function isMySong(songId: number, singerId: number) {
    try {
        const song = await MusicSinger.findOne({ where: { song_id: songId, user_id: singerId } });
        if (song) return true;
        return false
    }
    catch (err) {
        throw err;
    }
}

async function isSinger(userId: number): Promise<boolean> {
    try {
        const singer = await User.findOne({ where: { user_id: userId, is_singer: true  } });
        return !!singer;
    } catch (err) {
        throw err;
    }
}

export default {
    addSongToArtist,
    addSong,
    mySongs,
    isMySong,
    isSinger
}