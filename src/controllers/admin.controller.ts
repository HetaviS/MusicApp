import { logger } from "../utils";
import userService from "../services/user.service";
import { response_service } from "../services/index.service";
import { Request, Response } from "express";

export async function getAllUsersList(req: Request, res: Response) {
    try {
        const users = await userService.getAllUsersList();
        if (!users) return response_service.notFoundResponse(res, 'No users found.');
        return response_service.successResponse(res, 'Users list retrieved successfully.', users);
    } catch (error: any) {
        logger.error('Error getting all users list:', error);
        return response_service.internalServerErrorResponse(res, error.message);
    }
}