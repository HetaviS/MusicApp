import e, { Request, Response } from "express";
import { album_service, response_service, singer_service } from "../services/index.service";
import { logger } from "../utils";
import { ISong } from "../types";
import { config } from "../config";
import fs from "fs";

async function createAlbum(req: Request, res: Response) {
    try {
        const user = req.user;
        const is_private = req.body.is_private;
        if (is_private != 'true' && !req.user.admin_id) return response_service.badRequestResponse(res, 'You are not an artist.');
        if(is_private == 'true' && !req.user.user_id) return response_service.badRequestResponse(res,'You cannot create private albums.')
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        let songs = req.body.songs;
    
        if (songs.length <= 0) return response_service.badRequestResponse(res, 'You can add only your own songs.');
        let album_data;
        if (user.user_id){
         album_data = { ...req.body, thumbnail: files?.['album_thumbnail'][0].path, user_id: req.user.user_id };
        }
        else{
            album_data = { ...req.body, thumbnail: files?.['album_thumbnail'][0].path,}
        }   
        const album = await album_service.createAlbum(album_data);
        if (!album) return response_service.badRequestResponse(res, 'Failed to create album.');
        await album_service.addSongsToAlbum(songs, album.album_id);
        return response_service.successResponse(res, 'Album created successfully.', album);
    }
    catch (err: any) {
        logger.error('Error creating album:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function addSongsToAlbum(req: Request, res: Response) {
    try {
        let album = await album_service.getAlbum({ album_id: req.params.album_id, user_id: req.user.user_id });
        if (!album) return response_service.badRequestResponse(res, 'You are not the owner of this album.');
        let existing_songs = album.songs?.map((song: any) => song.song_id.toString());
        let songs = req.body.songs;
        existing_songs = album.songs?.filter((song: any) => songs.includes(song.song_id.toString()))
        if (existing_songs?.length > 0) return response_service.badRequestResponse(res, 'You can add only unique songs.');
        

        songs = await album_service.addSongsToAlbum(songs, req.params.album_id);
        if (!songs) return response_service.badRequestResponse(res, 'Failed to add songs to album.');
        return response_service.successResponse(res, 'Songs added to album successfully.', await album_service.getAlbum({ album_id: req.params.album_id }));
    }
    catch (err: any) {
        logger.error('Error adding songs to album:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function removeSongsFromAlbum(req: Request, res: Response) {
    try {
        let album = await album_service.getAlbum({ album_id: req.params.album_id});
        if (!album) return response_service.badRequestResponse(res, 'You are not the owner of this album.');
        const songs = await album_service.removeSongsFromAlbum(req.body.songs, req.params.album_id);
        if (songs && songs[0] == 0) return response_service.badRequestResponse(res, 'Failed to remove songs from album.');
        return response_service.successResponse(res, 'Songs removed from album successfully.', await album_service.getAlbum({ album_id: req.params.album_id }));
    }
    catch (err: any) {
        logger.error('Error adding songs to album:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function updateAlbum(req: Request, res: Response) {
    try {
        let album = await album_service.getAlbum({ album_id: req.params.album_id });
        if (!album) return response_service.badRequestResponse(res, 'You are not the owner of this album.');
        if (album.is_private && req.user.user_id != album.user_id) return response_service.badRequestResponse(res, '')
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let del_album;
        if (files?.['album_thumbnail']) del_album = album.thumbnail

        const album_data = { ...req.body, thumbnail: files?.['album_thumbnail']?.[0].path, songs: null };
        album = await album_service.updateAlbum(album_data, { album_id: req.params.album_id });
        if (!album) return response_service.badRequestResponse(res, 'Failed to update album.');
        fs.existsSync(album.thumbnail.replace(config.clientUrl, '')) && fs.unlinkSync(album.thumbnail.replace(config.clientUrl, ''));
        return response_service.successResponse(res, 'Album updated successfully.', album);
    }
    catch (err: any) {
        logger.error('Error updating album:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function getAlbum(req: Request, res: Response) {
    try {
        const user = req.user;
        const album = await album_service.getAlbum({ album_id: req.params.album_id});
        if (!album) return response_service.badRequestResponse(res, 'You are not the owner of this album.');
        if (!album.is_private || album.user_id == req.user.user_id) {
            return response_service.successResponse(res, 'Album fetched successfully.', album);
        }
        return response_service.badRequestResponse(res, 'You are not the owner of this album.');
    }
    catch (err: any) {
        logger.error('Error fetching album:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function getAllAlbums(req: Request, res: Response) {
    try {
        const user = req.user;
        const albums = await album_service.getAllAlbums(req.body.page, req.body.limit);
        if (!albums) return response_service.notFoundResponse(res, 'Albums not found.');
        return response_service.successResponse(res, 'Albums fetched successfully.', albums);
    } catch (err: any) {        

        logger.error('Error fetching albums:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

export {
    createAlbum,
    updateAlbum,
    addSongsToAlbum,
    removeSongsFromAlbum,
    getAlbum,
    getAllAlbums
};