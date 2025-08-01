import {
  response_service,
  singer_service,
  song_service,
  user_service,
} from "../services";
import { getAudioDuration } from "../utils/audioDuration";
import removeExtraFields from "../services/common/removeExtraFields.service";
import { Request, Response } from "express";
import { logger } from "../utils";
import { config } from "../config";
import fs from "fs";
import { Genre, Movie, MovieSongConnection, MusicSinger } from "../models";

async function getSong(req: Request, res: Response) {
  try {
    const song = await song_service.getSong(parseInt(req.body.song_id), [
      {
        model: Genre,
        as: "genre",
      },
      {
        model: MusicSinger,
        as: "artists",
      },
      {
        model: MovieSongConnection,
        as: "movie",
        include: [
          {
            model: Movie,
            as: "movie_details",
          },
        ],
      },
    ]);
    if (!song) return response_service.notFoundResponse(res, "Song not found.");
    const is_favorite = await song_service.isfavorite(
      parseInt(req.body.song_id),
      req.user?.user_id
    );
    return response_service.successResponse(res, "Song fetched successfully.", {
      ...song,
      is_favorite,
    });
  } catch (err: any) {
    logger.error("Error fetching song:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function setfavorite(req: Request, res: Response) {
  try {
    const user = req.user;
    const songId = parseInt(req.body.song_id);
    const song = await song_service.getSong(songId);
    if (!song) return response_service.notFoundResponse(res, "Song not found.");
    const isfavorite = await song_service.setfavorite(user.user_id, songId);
    return response_service.successResponse(
      res,
      `Song marked as favorite: ${isfavorite}.`
    );
  } catch (err: any) {
    logger.error("Error setting favorite:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function setDownloaded(req: Request, res: Response) {
  try {
    const user = req.user;
    const songId = parseInt(req.body.song_id);
    const song = await song_service.getSong(songId);
    if (!song) return response_service.notFoundResponse(res, "Song not found.");
    const isDownloaded = await song_service.setDownloaded(user.user_id, songId);
    return response_service.successResponse(
      res,
      `Song marked as downloaded: ${isDownloaded}.`
    );
  } catch (err: any) {
    logger.error("Error setting downloaded:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getMySongs(req: Request, res: Response) {
  try {
    const artist = await user_service.getUser(
      { user_id: req.body.artist_id, is_singer: true },
      [],
      ["user_id", "full_name", "profile_pic"]
    );
    if (!artist)
      return response_service.notFoundResponse(res, "Artist not found.");
    const is_favorite = await singer_service.isfavorite(
      req.user.user_id,
      req.body.artist_id
    );
    const songs = await singer_service.mySongs(
      parseInt(req.body.artist_id),
      req.body.page,
      req.body.limit
    );
    await Promise.all(
      songs.data.map(async (song: any) => {
        const is_favorite = await song_service.isfavorite(
          song.song_id,
          req.user?.user_id
        );
        return { ...song, is_favorite };
      })
    );

    if (songs) {
      return response_service.successResponse(
        res,
        "Songs fetched successfully.",
        songs.data
      );
    }
    return response_service.badRequestResponse(res, "Failed to fetch songs.");
  } catch (err: any) {
    logger.error("Error fetching songs:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function createMusic(req: Request, res: Response) {
  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    if (!files || !files["thumbnail"] || !files["audio"])
      return response_service.badRequestResponse(
        res,
        "Audio and thumbnail are required."
      );
    const audio = files["audio"][0];
    const duration = await getAudioDuration(audio?.path as string);
    const thumbnail = files["thumbnail"][0];
    if (!audio || !thumbnail)
      return response_service.badRequestResponse(
        res,
        "Audio and thumbnail are required."
      );
    let song = await singer_service.addSong({
      category_id: req.body.category_id,
      genre_id: req.body.genre_id,
      audio: audio.path,
      thumbnail: thumbnail.path,
      title: req.body.title,
      duration: duration.toString(),
    });
    if (song) {
      const artist_ids = req.body.artist_ids;
      artist_ids.forEach(async (artist_id: string) => {
        const is_singer = await singer_service.isSinger(parseInt(artist_id));
        if (is_singer) {
          await singer_service.addSongToArtist(
            parseInt(song?.song_id),
            parseInt(artist_id)
          );
        }
      });
      return response_service.successResponse(
        res,
        "Music added successfully.",
        removeExtraFields(song, ["genre_id"])
      );
    }
    return response_service.badRequestResponse(res, "Failed to add song.");
  } catch (err: any) {
    logger.error("Error adding song:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function updateSong(req: Request, res: Response) {
  try {
    const songId = parseInt(req.body.song_id);
    const song = await song_service.getSong(songId);
    if (!song) return response_service.notFoundResponse(res, "Song not found.");

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    let updatedData: any = { ...req.body };

    if (files && files["audio"]) {
      updatedData.audio = files["audio"][0].path;
      const duration = await getAudioDuration(updatedData.audio);
      updatedData.duration = duration.toString();
      if (song.audio) {
        fs.existsSync(song.audio.replace(config.clientUrl, "")) &&
          fs.unlinkSync(song.audio.replace(config.clientUrl, ""));
      }
    }

    if (files && files["thumbnail"]) {
      updatedData.thumbnail = files["thumbnail"][0].path;
      if (song.thumbnail) {
        fs.existsSync(song.thumbnail.replace(config.clientUrl, "")) &&
          fs.unlinkSync(song.thumbnail.replace(config.clientUrl, ""));
      }
    }

    const updatedSong = await song_service.updateSong(songId, updatedData);
    if (updatedSong) {
      return response_service.successResponse(
        res,
        "Song updated successfully.",
        updatedSong
      );
    }
    return response_service.badRequestResponse(res, "Failed to update song.");
  } catch (err: any) {
    logger.error("Error updating song:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getNextSong(req: Request, res: Response) {
  try {
    const song_ids = await song_service.getTotalSongs();
    let song_id = song_ids[Math.floor(Math.random() * song_ids.length)];
    const song = await song_service.getSong(parseInt(song_id));
    if (!song) return response_service.notFoundResponse(res, "Song not found.");
    const is_favorite = await song_service.isfavorite(
      parseInt(song_id),
      req.user?.user_id
    );
    return response_service.successResponse(res, "Song fetched successfully.", {
      ...song,
      is_favorite,
    });
  } catch (err: any) {
    logger.error("Error fetching next song:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getfavoriteSongs(req: Request, res: Response) {
  try {
    const songs = await song_service.getfavoriteSongs(
      req.user?.user_id,
      req.body.page,
      req.body.limit
    );
    if (!songs)
      return response_service.notFoundResponse(res, "Songs not found.");
    return response_service.successResponse(
      res,
      "Songs fetched successfully.",
      songs
    );
  } catch (err: any) {
    logger.error("Error fetching favorite songs:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getAllSongs(req: Request, res: Response) {
  try {
    const songs = await song_service.getAllSongs(
      req.body.album_id,
      req.body.page,
      req.body.limit
    );
    if (!songs)
      return response_service.notFoundResponse(res, "Songs not found.");
    return response_service.successResponse(
      res,
      "Songs fetched successfully.",
      songs
    );
  } catch (err: any) {
    logger.error("Error fetching all songs:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

export {
  getSong,
  setfavorite,
  setDownloaded,
  getMySongs,
  createMusic,
  updateSong,
  getNextSong,
  getfavoriteSongs,
  getAllSongs,
};
