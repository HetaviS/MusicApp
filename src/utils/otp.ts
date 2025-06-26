import nodemailer from 'nodemailer';
import { logger } from "./logger";
import { config, emailConfig } from '../config';
import axios from 'axios';
import process from 'process';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import twilio from 'twilio';

const twilioClient = twilio(accountSid, authToken);

async function sendTwilioOTP(country_code: string, mobile_num: string, otp: string) {
    // Create a transporter object using SMTP transport
    try {
        // Send email
        if (process.env.NODE_ENV == "development") {
            return true
        }
        const response = await twilioClient.messages.create({
            body: `Otp from Reel Boost is ${otp}.`,
            to: `${country_code}${mobile_num}`,
            from: process.env.TWILIO_FROM_NUMBER,
        })

        if (response.status === "queued" || response.status === "sent" || response.status === "delivered") {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error("Error sending otp in twilio:", err);
        return false; // Error occurred while sending email
    }
}
async function sendMesg91TP(country_code: string, mobile_num: string, otp: string) {
    // Create a transporter object using SMTP transport
    try {
        // Send email
        if (process.env.NODE_ENV == "development") {
            return true
        }
        const response = await axios.get("https://api.msg91.com/api/v5/otp", {
            params: {
                authkey: process.env.MSG91_API_KEY,
                template_id: process.env.MSG91_TEMPLATE_ID, // Template ID from your MSG91 account
                mobile: `91${mobile_num}`,
                // variables: { OTP: generatedOtp },
                otp: otp,
                sender: process.env.MSG91_SENDER_ID,
            },
        });
        if (response.data.type === "success") {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error("Error sending otp in Message91:", err);
        return false; // Error occurred while sending email
    }
}


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
    sendTwilioOTP,
    sendMesg91TP
}