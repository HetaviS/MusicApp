import { logger } from "../utils";
import { config } from "../config/index";
import {
    user_service,
    response_service,
    token_service
} from "../services/index.service";
import { Request, Response } from 'express';
import removeExtraFields from "../services/common/removeExtraFields.service";
import { sendEmailOTP } from "../utils/email";

async function register(req: Request, res: Response) {
    try {
        if (req.body.login_type == 'email') {
            let user = await user_service.getUser({ email: req.body.email });
            let otp = config.nodeEnv === 'development' ? '123456' : generateOTP();
            const otpSent = await sendEmailOTP(req.body.email, otp);
            if (!otpSent) {
                return response_service.badRequestResponse(res, 'Failed to send OTP.');
            }
            if (user) {
                return response_service.successResponse(res, 'OTP sent successfully.', { newUser: false });
            }
            else {
                await user_service.createUser({ ...req.body, otp });
                return response_service.successResponse(res, 'OTP sent successfully.', { newUser: true });
            }
        }
    }
    catch (err: any) {
        logger.error('Error registering user:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function resendOTP(req: Request, res: Response) {
    try {
        let otp = config.nodeEnv === 'development' ? '123456' : generateOTP();
        const otpSent = await sendEmailOTP(req.body.email, otp);
        if (!otpSent) {
            return response_service.badRequestResponse(res, 'Failed to send OTP.');
        }
        const user = await user_service.updateUser({ otp: parseInt(otp) }, { email: req.body.email });
        if (user) return response_service.successResponse(res, 'OTP resent successfully.');
        return response_service.badRequestResponse(res, 'Email not registered.');
    } catch (err: any) {
        logger.error('Error resending OTP:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

// To Genrate OTP
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

async function verifyOtp(req: Request, res: Response) {
    try {
        let user = await user_service.getUser({ email: req.body.email, otp: req.body.otp });
        if (user) {
            const token = await token_service.generateToken(user);
            await user_service.updateUser({ login_verification_status: true, otp: 0 }, { email: req.body.email });
            return response_service.successResponse(res, 'OTP verified successfully.', { user: removeExtraFields(user, ['otp', 'login_verification_status', 'login_type', 'is_admin', 'device_token']), token });
        }
        else {
            return response_service.badRequestResponse(res, 'Invalid otp.');
        }
    } catch (err: any) {
        logger.error('Error verifying OTP:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}


export {
    register,
    verifyOtp,
    resendOTP
};