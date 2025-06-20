import { admin_service, response_service } from "../services/index.service";
import { Request, Response } from 'express';
import { IAdmin } from '../types';
import tokenService from "../services/common/token.service";
import removeExtraFields from "../services/common/removeExtraFields.service";
import { logger } from "../utils";

export async function verifyAdmin(req: Request, res: Response) {
    try {
        const data = req.body as Partial<IAdmin>;
        const admin = await admin_service.verifyAdmin(data);
        if (!admin) return response_service.notFoundResponse(res, 'Admin not found.');
        const token = await tokenService.generateAdminToken(admin);
        return response_service.successResponse(res, 'Admin verified successfully.', { ...await removeExtraFields(admin, ['password']), token });
    } catch (err: any) {
        logger.error('Error verifying admin:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

export async function updateAdmin(req: Request, res: Response) {
    try {
        const data = req.body as Partial<IAdmin>;
        const admin = await admin_service.updateAdmin(data, { admin_id: req.user.admin_id });
        return response_service.successResponse(res, 'Admin updated successfully.', await removeExtraFields(admin, ['password']));
    } catch (err: any) {
        logger.error('Error updating admin:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}
