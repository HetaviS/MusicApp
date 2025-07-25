import { user_service, response_service, dashboard_service } from "../services";
import { Request, Response } from "express";
import { logger } from "../utils";
import { config } from "../config";
import fs from "fs";

async function createArtist(req: Request, res: Response) {
  try {
    const artistPayload = req.body;
    let user;
    if (req.body.login_type == "email" && req.body.email) {
      user = await user_service.getUser({ email: req.body.email });
      if (user)
        return response_service.badRequestResponse(
          res,
          "Email already exists."
        );
    } else if (req.body.login_type == "mobile" && req.body.mobile_number) {
      user = await user_service.getUser({
        mobile_number: req.body.mobile_number,
      });
    }
    if (user)
      return response_service.badRequestResponse(
        res,
        "Mobile number already exists."
      );
    const artist = await user_service.createUser({
      ...artistPayload,
      is_singer: true,
    });
    if (!artist)
      return response_service.badRequestResponse(
        res,
        "Failed to create artist."
      );
    return response_service.successResponse(
      res,
      "Artist created successfully.",
      artist
    );
  } catch (err: any) {
    logger.error("Error creating artist:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function updateArtist(req: Request, res: Response) {
  try {
    const artistId = req.body.user_id;
    const artistPayload = req.body;
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    let artist = await user_service.getUser({
      user_id: artistId,
      is_singer: true,
      is_deleted: false,
    });
    let del_profile_pic;
    if (files && files["profile_pic"]) {
      artistPayload.profile_pic = files["profile_pic"][0].path;
      del_profile_pic = artist?.profile_pic;
    }
    artist = await user_service.updateUser(
      { ...artistPayload },
      { user_id: artistId, is_singer: true, is_deleted: false }
    );
    if (!artist)
      return response_service.badRequestResponse(res, "Artist not found.");
    if (del_profile_pic && !del_profile_pic?.includes("default_profile_pics")) {
      const pic = del_profile_pic.replace(config.clientUrl, "");
      fs.existsSync(pic) && fs.unlinkSync(pic);
    }
    return response_service.successResponse(
      res,
      "Artist updated successfully.",
      artist
    );
  } catch (err: any) {
    logger.error("Error updating artist:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function deleteArtist(req: Request, res: Response) {
  try {
    const artistId = req.body.user_id;
    const artist = await user_service.updateUser(
      { is_deleted: true },
      { user_id: artistId, is_singer: true, is_deleted: false }
    );
    if (!artist)
      return response_service.badRequestResponse(res, "Artist not found.");
    return response_service.successResponse(
      res,
      "Artist deleted successfully.",
      artist
    );
  } catch (err: any) {
    logger.error("Error deleting artist:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getArtists(req: Request, res: Response) {
  try {
    const artist = await dashboard_service.getAllUsersList(
      { is_singer: true },
      req.body.page,
      req.body.limit
    );
    if (!artist)
      return response_service.notFoundResponse(res, "Artist not found.");
    return response_service.successResponse(
      res,
      "Artist fetched successfully.",
      artist
    );
  } catch (err: any) {
    logger.error("Error fetching artist:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

export { createArtist, updateArtist, deleteArtist, getArtists };
