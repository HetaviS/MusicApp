import { IUser } from "../types";
import { Album, Movie, Song, User } from "../models";
import {  fn, col, literal } from 'sequelize';
import removeExtraFields from "./common/removeExtraFields.service";

type Timeframe = 'day' | 'week' | 'month' | 'year'|'total';

export async function count(timeframe: Timeframe, entity: 'users' | 'songs' | 'albums' | 'artists'|'movies'): Promise<any[]> {
    try {
        let format: string;
        

        switch (timeframe) {
            case 'total':
                format = ""; // Use a fixed format for total
                break;
            case 'day':
                format = 'YYYY-MM-DD';
                break;
            case 'week':
                format = 'IYYY-IW'; // ISO year and week number
                break;
            case 'month':
                format = 'YYYY-MM';
                break;
            case 'year':
                format = 'YYYY';
                break;
            case 'total':
                format = 'YYYY-MM-DD'; // Use a fixed format for total
                break;
            default:
                throw new Error('Invalid timeframe');
        }
        if (format === '') {
              // Return only total count
              switch (entity) {
                case 'users':
                    const total = await User.count({ where: { is_deleted: false } });
                    return [{ period: 'Total', count: total }];
                case 'songs':
                    const totalSongs = await Song.count();
                    return [{ period: 'Total', count: totalSongs }];
                case 'albums':
                      const totalAlbums = await Album.count({ where: { is_deleted: false } });
                    return [{ period: 'Total', count: totalAlbums }];
                case 'artists':
                    const totalArtists = await User.count({ where: { is_deleted: false, is_singer: true } });
                      return [{ period: 'Total', count: totalArtists }];
                case 'movies':
                      const totalMovies = await Movie.count({ where: { is_deleted: false } });
                    return [{ period: 'Total', count: totalMovies }];
                default:
                    throw new Error('Invalid entity type');
            }
        }

        switch (entity) {
            case 'users':
                const result = await User.findAll({
                    attributes: [
                        [fn('TO_CHAR', col('createdAt'), format), 'period'],
                        [fn('COUNT', col('user_id')), 'count']
                    ],
                    where: { is_deleted: false },
                    group: [fn('TO_CHAR', col('createdAt'), format)],
                    order: [ [literal(`period`), 'ASC'] ]
                });
                
                return result.map(row => row.toJSON());
            case 'songs':
                return await Song.findAll({
                    attributes: [
                        [fn('TO_CHAR', col('createdAt'), format), 'period'],
                        [fn('COUNT', col('song_id')), 'count']
                    ],
                    group: [fn('TO_CHAR', col('createdAt'), format)],
                    order: [ [literal(`period`), 'ASC'] ]
                }).then(result => result.map(row => row.toJSON()));
            case 'albums':
                return await Album.findAll({
                    attributes: [
                        [fn('TO_CHAR', col('createdAt'), format), 'period'],
                        [fn('COUNT', col('album_id')), 'count']
                    ],
                    group: [fn('TO_CHAR', col('createdAt'), format)],
                    order: [ [literal(`period`), 'ASC'] ]
                }).then(result => result.map(row => row.toJSON()));
            case 'artists':
                return await User.findAll({
                    attributes: [
                        [fn('TO_CHAR', col('createdAt'), format), 'period'],
                        [fn('COUNT', col('user_id')), 'count']
                    ],
                    where: { is_deleted: false, is_singer: true },
                    group: [fn('TO_CHAR', col('createdAt'), format)],
                    order: [ [literal(`period`), 'ASC'] ]
                }).then(result => result.map(row => row.toJSON()));
            case 'movies':
                return await Movie.findAll({
                    attributes: [
                        [fn('TO_CHAR', col('createdAt'), format), 'period'],
                        [fn('COUNT', col('movie_id')), 'count']
                    ],
                    group: [fn('TO_CHAR', col('createdAt'), format)],
                    order: [ [literal(`period`), 'ASC'] ]
                })
            default:
                throw new Error('Invalid entity type');
        }

    } catch (err) {
        throw err;
    }
}

interface PaginatedUsersResult {
  data: IUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function getAllUsersList(
  where: Partial<IUser> = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedUsersResult> {
  try {
    const offset = (page - 1) * pageSize;

    const { rows: users, count: total } = await User.findAndCountAll({
      where: { is_deleted: false, ...where },
      limit: pageSize,
      offset,
    });

    const cleanedUsers: IUser[] = users.map(user =>
      removeExtraFields(user.toJSON(), [
        'password',
        'otp',
        'current_song_time',
        'current_song_id',
        'current_album_id',
      ]) as IUser
    );

    return {
      data: cleanedUsers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    throw err;
  }
}

async function usersByLogin(){
    try {
        const result = await User.findAll({
            attributes: [
                'login_type',
                [fn('COUNT', col('user_id')), 'count']
            ],
            where: { is_deleted: false },
            group: ['login_type'],
            order: [[literal(`count`), 'DESC']]
        });
        
        return result.map(row => row.toJSON());
    } catch (err) {
        throw err;
    }
}

export default {
    getAllUsersList,
    count,
    usersByLogin,
};