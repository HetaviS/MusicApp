import { Album, Genre,HomeBlocks,  Song } from '../models';
import {  IHomeBlocks } from '../types';
import { genre_category_service, user_service } from './index.service';

async function getAllSongsByGenre(page: number = 1, pageSize: number = 10): Promise<any[]> {
    try {
        const offset = (page - 1) * pageSize;
        const genres = await Genre.findAll({
            limit: pageSize,
            offset
        });
        return genres.map(genre => genre.toJSON());
    } catch (err) {
        throw err;
    }
}

async function addBlock(blockPayload:Partial<IHomeBlocks>): Promise<IHomeBlocks> {
    try{
        const block = await HomeBlocks.create(blockPayload);
        return block.toJSON();
    }
    catch (err){
        throw err;
    }
}

async function updateBlock(blockPayload: Partial<IHomeBlocks>, blockId: number): Promise<IHomeBlocks | null> {
    try {
        const [updatedRows, updatedBlock] = await HomeBlocks.update(blockPayload, {
            where: { block_id: blockId },
            returning: true
        });
        return updatedRows ? updatedBlock[0].toJSON() : null;
    } catch (err) {
        throw err;
    }
}

async function addDataToBlock(blockId: number, data: Partial<IHomeBlocks>): Promise<IHomeBlocks | null> {
    try {
        const block = await HomeBlocks.findByPk(blockId) as any;
        if (!block) return null;

        if (block.type === 'album') {
            block.album_ids = [...(block.album_ids || []), ...(data.album_ids || [])];
        } else if (block.type === 'song') {
            block.song_ids = [...(block.song_ids || []), ...(data.song_ids || [])];
        } else if (block.type === 'genre') {
            block.genre_ids = [...(block.genre_ids || []), ...(data.genre_ids || [])];
        }
        else if (block.type === 'artist') {
            block.artist_ids = [...(block.artist_ids || []), ...(data.artist_ids || [])];
        }
        await block.save();
        return block.toJSON();
    } catch (err) {
        throw err;
    }
}

async function removeDataFromBlock(blockId: number, data: Partial<IHomeBlocks>): Promise<IHomeBlocks | null> {
    try {
        const block = await HomeBlocks.findByPk(blockId) as any;
        if (!block) return null;
        if (block.type === 'album') {
            block.album_ids = (block.album_ids || []).filter((id:number) => (!(data.album_ids || []).map(String).includes((id).toString())));
        } else if (block.type === 'song') {
            block.song_ids = (block.song_ids || []).filter((id: number) => (!(data.song_ids || []).map(String).includes((id).toString())));
        } else if (block.type === 'genre') {
            block.genre_ids = (block.genre_ids || []).filter((id: number) => (!(data.genre_ids || []).map(String).includes((id).toString())));
        } else if (block.type === 'artist') {
            block.artist_ids = (block.artist_ids || []).filter((id: number) => (!(data.artist_ids || []).map(String).includes((id).toString())));
        }

        await block.save();
        return block.toJSON();
    } catch (err) {
        throw err;
    }
}

async function getAllBlocks(page: number = 1, limit: number = 10): Promise<{ blocks: IHomeBlocks[]; total: number; totalPages: number; currentPage: number }> {
    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await HomeBlocks.findAndCountAll({
            where: { is_deleted: false },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        return {
            blocks: rows.map(block => block.toJSON() as IHomeBlocks),
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        };
    } catch (err) {
        throw err;
    }
}

async function getBlock(blockId: number): Promise<IHomeBlocks | null> {
    try {
        const block = await HomeBlocks.findByPk(blockId) as any;
        //Populate the block with related data based on its type
        if (!block) return null;
        let data: any = [];
        if (block.type === 'album') {
            data = await Promise.all(block.album_ids.map(async (id: number) => await Album.findByPk(id)));
        } else if (block.type === 'song') {
            data = await Promise.all(block.song_ids.map(async (id: number) => await Song.findByPk(id)));
        } else if (block.type === 'genre') {
            data = await Promise.all(block.genre_ids.map(async (id: number) => await genre_category_service.getGenreById(id)));
        } else if (block.type === 'artist') {
            data = await Promise.all(block.artist_ids.map(async (id: number) => await user_service.getUser({user_id:(id).toString()})) );
        }
        return block ? ({...block.toJSON(),data} as IHomeBlocks) : null;
    } catch (err) {
        throw err;
    }
}

export default {
    getAllSongsByGenre,
    addBlock,
    updateBlock,
    addDataToBlock,
    removeDataFromBlock,
    getAllBlocks,
    getBlock
};