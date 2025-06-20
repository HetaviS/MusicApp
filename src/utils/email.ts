import nodemailer from 'nodemailer';
import { logger } from "./logger";
import { config, emailConfig } from '../config';

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

const sendEmailOTP = async (email: string, otp: string) => {
    if (config.nodeEnv === 'development') {
        return true;
    }

    const transporter = nodemailer.createTransport({
        service: emailConfig.service,
        host: emailConfig.host,
        port: Number(emailConfig.port),
        secure: false,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    });

    const mailOptions = {
        from: emailConfig.user,
        to: email,
        subject: 'OTP for Verification on Music App',
        text: `Your OTP is: ${otp}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info
    } catch (err) {
        logger.error("Error sending email:", err);
        return false;
    }
};


export {
    generateOTP,
    sendEmailOTP,
}