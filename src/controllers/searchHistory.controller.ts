import { Request, Response } from "express";
import { logger } from "../utils";
import { response_service, searchHistory_service } from "../services";

async function addToSearchHistory(req: Request, res: Response) {
  try {
    const searchHistory = await searchHistory_service.addToSearchHistory(
      req.user.user_id,
      req.body.type,
      req.body.song_id,
      req.body.artist_id,
      req.body.album_id,
      req.body.genre_id
    );
    return response_service.successResponse(
      res,
      "Search history added successfully.",
      searchHistory
    );
  } catch (err: any) {
    logger.error("Error adding to search history:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getSearchHistory(req: Request, res: Response) {
  try {
    const searchHistory = await searchHistory_service.getSearchHistory(
      req.user.user_id,
      req.body.page,
      req.body.limit
    );
    return response_service.successResponse(
      res,
      "Search history fetched successfully.",
      searchHistory
    );
  } catch (err: any) {
    logger.error("Error fetching search history:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function removeFromSearchHistory(req: Request, res: Response) {
  try {
    const searchHistory = await searchHistory_service.removeFromSearchHistory(
      req.user.user_id,
      req.body.search_id
    );
    return response_service.successResponse(
      res,
      "Search history removed successfully.",
      searchHistory
    );
  } catch (err: any) {
    logger.error("Error removing from search history:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

export { addToSearchHistory, getSearchHistory, removeFromSearchHistory };
