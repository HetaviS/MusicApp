import { dashboard_service , response_service} from "../services/index.service";
import { Request, Response } from 'express';
import { logger } from "../utils";


async function getUsersCount(req: Request, res: Response) {
    try {
        const count = await dashboard_service.usersCount(req.body.filter_by,req.body.entity);
        return response_service.successResponse(res, req.body.entity+' count retrieved successfully.', { count });
    } catch (err: any) {
        logger.error(`Error retrieving ${req.body.entity} count:`, err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

 async function getAllUsersList(req: Request, res: Response) {
    try {
        const users = await dashboard_service.getAllUsersList({}, req.body.page, req.body.limit);
        if (!users) return response_service.notFoundResponse(res, 'No users found.');
        return response_service.successResponse(res, 'Users list retrieved successfully.', users);
    } catch (error: any) {
        logger.error('Error getting all users list:', error);
        return response_service.internalServerErrorResponse(res, error.message);
    }
}

async function usersByLogin(req: Request, res: Response) {
    try {
        const users = await dashboard_service.usersByLogin();
        if (!users) return response_service.notFoundResponse(res, 'No users found for this login type.');
        return response_service.successResponse(res, 'Users list retrieved successfully.', users);
    } catch (error: any) {
        logger.error('Error getting users by login type:', error);
        return response_service.internalServerErrorResponse(res, error.message);
    }
}

export {
    getUsersCount,
    getAllUsersList,
    usersByLogin
}