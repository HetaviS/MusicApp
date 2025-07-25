import { config_service, response_service } from "../services";
import { Request, Response } from "express";
import { logger } from "../utils";

async function getConfig(req: Request, res: Response) {
  try {
    const config = await config_service.getConfig();
    if (!config)
      return response_service.notFoundResponse(res, "Config not found.");
    return response_service.successResponse(
      res,
      "Config fetched successfully.",
      config
    );
  } catch (err: any) {
    logger.error("Error fetching config:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function createConfig(req: Request, res: Response) {
  try {
    const config = await config_service.createConfig(req.body);
    return response_service.successResponse(
      res,
      "Config created successfully.",
      config
    );
  } catch (err: any) {
    logger.error("Error creating config:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function updateConfig(req: Request, res: Response) {
  try {
    const config = await config_service.updateConfig(req.body);
    if (!config)
      return response_service.notFoundResponse(res, "Config not found.");
    return response_service.successResponse(
      res,
      "Config updated successfully.",
      config
    );
  } catch (err: any) {
    logger.error("Error updating config:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

export { getConfig, createConfig, updateConfig };