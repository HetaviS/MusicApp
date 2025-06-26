import { genre_category_service, response_service } from "../services/index.service";

import { Request, Response } from 'express';
import { logger } from "../utils";


async function createGenre(req: Request, res: Response) {
    try {
        const genrePayload = req.body;
        const genre = await genre_category_service.createGenre(genrePayload);
        if (!genre) return response_service.badRequestResponse(res, 'Failed to create genre.');
        return response_service.successResponse(res, 'Genre created successfully.', genre);
    } catch (err: any) {
        logger.error('Error creating genre:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function removeGenre(req: Request, res: Response) {
    try {
        const genreId = parseInt(req.params.genre_id);
        const result = await genre_category_service.removeGenre(genreId);
        if (result === 0) return response_service.notFoundResponse(res, 'Genre not found or already deleted.');
        return response_service.successResponse(res, 'Genre deleted successfully.');
    } catch (err: any) {
        logger.error('Error deleting genre:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}


async function getAllGenre(req: Request, res: Response) {
    try {
        const genreCategories = await genre_category_service.getAllGenres(req.body.page, req.body.limit);
        if (!genreCategories) return response_service.notFoundResponse(res, 'Genre not found.');
        return response_service.successResponse(res, 'Genre fetched successfully.', genreCategories);
    } catch (err: any) {
        logger.error('Error fetching genre:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function getSongsByGenre(req: Request, res: Response) {
    try {
        const genreId = parseInt(req.params.genre_id);
        const songs = await genre_category_service.getSongsByGenre(genreId, req.body.page, req.body.limit);
        if (!songs) return response_service.notFoundResponse(res, 'Songs not found for this genre.');
        return response_service.successResponse(res, 'Songs fetched successfully.', songs);
    } catch (err: any) {
        logger.error('Error fetching songs by genre:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

export {
    createGenre,
    removeGenre,
    getAllGenre,
    getSongsByGenre,
};