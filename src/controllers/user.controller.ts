import { user_service, response_service, history_service } from "../services/index.service";
import { Request, Response } from "express";
import { logger } from "../utils";
import removeExtraFields from "../services/common/removeExtraFields.service";
import * as fs from 'fs';
import { getAvatar } from "../services/avatar.service";
import { config } from "../config";


async function getUser(req: Request, res: Response) {
    try {
        const user = await user_service.getUser({ user_id: req.user.user_id });
        if (!user) return response_service.notFoundResponse(res, 'User not found.');
        return response_service.successResponse(res, 'User retrieved successfully.', removeExtraFields(user, ['otp', 'login_verification_status', 'login_type', 'is_admin', 'device_token']));
    } catch (err: any) {
        logger.error('Error retrieving user:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

/**
 * Updates the user information.
 * @param req - The request object containing user data to update.
 * @param res - The response object to send the result.
 * @returns A success response with updated user data or an error response.
 */
async function updateUser(req: Request, res: Response) {
    try {
        if (req.body.is_singer) {
            req.body.is_singer = req.body.is_singer.toLowerCase() == 'true' ? true : false;
        }
        let user = await user_service.getUser({ user_id: req.user.user_id });

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        if (files?.['profile_pic']) {
            req.body.profile_pic = files['profile_pic'][0].path
            if (user?.profile_pic && !user?.profile_pic?.includes('default_profile_pics')) {
                const pic = user.profile_pic.replace(config.clientUrl, '')
                fs.unlinkSync(pic || '');
            }
        }
        else if (req.body.avatar_id) {
            const avatar = await getAvatar(req.body.avatar_id);
            req.body.profile_pic = avatar?.path.replace(config.clientUrl, '');
            if (user?.profile_pic && !user?.profile_pic?.includes('default_profile_pics')) {
                const pic = user.profile_pic.replace(config.clientUrl, '')
                fs.unlinkSync(pic || '');
            }
        }
        user = await user_service.updateUser(req.body, { user_id: req.user.user_id });
        return response_service.successResponse(res, 'User updated successfully.', removeExtraFields(user, ['otp', 'login_verification_status', 'login_type', 'is_admin', 'device_token']));

    } catch (err: any) {
        logger.error('Error updating user:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function updateCurrentsong(req: Request, res: Response) {
    try {
        const user = await user_service.updateUser({ current_song_id: req.body.current_song_id, current_album_id: req.body.current_album_id, current_song_time: req.body.current_song_time }, { user_id: req.user.user_id });
        if (!user) return response_service.notFoundResponse(res, 'User not found.');
        if (!user.current_song_id) { return response_service.badRequestResponse(res, 'Current song is not set.'); }
        const data = await history_service.addToHistory(parseInt(user.current_song_id), parseInt(user.user_id), user.current_album_id ? parseInt(user.current_album_id) : null, user.current_song_time);
        return response_service.successResponse(res, 'Current song updated successfully.', removeExtraFields(data, ['otp', 'login_verification_status', 'login_type', 'is_admin', 'device_token']));
    } catch (err: any) {
        logger.error('Error updating current song:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function updateSongTime(req: Request, res: Response) {
    try {
        const user = await user_service.updateUser({ current_song_time: req.body.current_song_time }, { user_id: req.user.user_id });
        if (!user) return response_service.notFoundResponse(res, 'User not found.');
        if (!user.current_song_time) { return response_service.badRequestResponse(res, 'Current song is not set.'); }
        const data = await history_service.updateHistoryTime(req.body.history_id, user.current_song_time);
        return response_service.successResponse(res, 'Current song time updated successfully.', removeExtraFields(data, ['otp', 'login_verification_status', 'login_type', 'is_admin', 'device_token']));
    } catch (err: any) {
        logger.error('Error updating current song time:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function userHistory(req: Request, res: Response) {
    try {
        const history = await history_service.getUserHistory(req.user.user_id);
        if (!history) return response_service.notFoundResponse(res, 'No history found for this user.');
        return response_service.successResponse(res, 'User history retrieved successfully.', history);
    } catch (err: any) {
        logger.error('Error retrieving user history:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function validateUsername(req: Request, res: Response) {
    try {
        const user = await user_service.getUser({ username: req.body.username });
        if (user) {
            return response_service.successResponse(res, "Username already exists.", { is_available: false });
        } else {
            return response_service.successResponse(res, "Username is available.", { is_available: true });
        }
    } catch (error: any) {
        logger.error('Error validating username:', error);
        return response_service.internalServerErrorResponse(res, error.message);
    }
}

export { getUser, updateUser, updateCurrentsong, userHistory, updateSongTime, validateUsername };