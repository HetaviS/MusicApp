import { Album, Downloads, Favourites, Song } from '../models';
import { User } from '../models/user';
import { IUser } from '../types';
import removeExtraFields from './common/removeExtraFields.service';

async function getUser(data: Partial<IUser>): Promise<IUser | null> {
    try {
        const user = await User.findOne({
            where: data,
            include: [
                { model: Song, as: 'currentSong' },
                { model: Album, as: 'currentAlbum' },
                { model: Favourites, as: 'favourites' },
                { model: Downloads, as: 'downloads' }
            ]
        });
        if (!user) return null;
        return user.toJSON() as IUser;
    } catch (err) {
        throw err;
    }
}

async function createUser(data: Partial<IUser>): Promise<IUser | null> {
    try {
        const user = await User.create(data);
        if (!user) return null;
        return user.toJSON() as IUser;
    } catch (err) {
        throw err;
    }
}

async function updateUser(data: Partial<IUser>, where: Partial<IUser>): Promise<IUser | null> {
    try {
        const user = await User.update(data, { where: where, returning: true });
        if (user[1].length <= 0) return null;
        return user[1][0].toJSON() as IUser;
    } catch (err) {
        throw err;
    }
}

async function getAllUsersList() {
    try {
        const users = await User.findAll();
        return users.map(user => removeExtraFields(user.toJSON(), ['password', 'otp', 'current_song_time', 'current_song_id', 'current_album_id']) as IUser);
    } catch (err) {
        throw err;
    }
}

export default { getUser, createUser, updateUser, getAllUsersList };