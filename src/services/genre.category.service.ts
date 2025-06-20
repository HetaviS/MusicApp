import { Genre, Categories, Song } from "../models";
import { IGenre, ICategories } from "../types";

async function getAllGenres(): Promise<IGenre[]> {
    try {
        const genres = await Genre.findAll();
        return genres.map(genre => genre.toJSON());
    } catch (err) {
        throw err;
    }
}

async function getAllCategories(): Promise<ICategories[]> {
    try {
        const categories = await Categories.findAll();
        return categories.map(category => category.toJSON());
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
async function createCategory(categoryPayload: Partial<ICategories>): Promise<ICategories | null> {
    try {
        const category = await Categories.create(categoryPayload);
        return category.toJSON();
    } catch (err) {
        throw err;
    }
}

async function removeGenre(genreId: number): Promise<number> {
    try {
        const result = await Genre.destroy({ where: { genre_id: genreId } });
        return result;
    } catch (err) {
        throw err;
    }
}
async function removeCategory(categoryId: number): Promise<number> {
    try {
        const result = await Categories.destroy({ where: { category_id: categoryId } });
        return result;
    } catch (err) {
        throw err;
    }
}

async function getSongsByGenre(genreId: number): Promise<IGenre[]> {
    try {
        const music = await Genre.findAll({ where: { genre_id: genreId }, include: [{ model: Song, as: 'songs' }] });
        return music.map(genre => genre.toJSON());
    } catch (err) {
        throw err;
    }
}

async function getSongsByCategory(categoryId: number): Promise<ICategories[]> {
    try {
        const music = await Categories.findAll({ where: { category_id: categoryId }, include: [{ model: Song, as: 'songs' }] });
        return music.map(category => category.toJSON());
    } catch (err) {
        throw err;
    }
}

export default {
    getAllGenres,
    getAllCategories,
    createGenre,
    createCategory,
    removeGenre,
    removeCategory,
    getSongsByGenre,
    getSongsByCategory
};