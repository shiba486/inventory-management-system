import nodemailer from "nodemailer"
import { config } from "../config/config.js"



const SendEmailUtility= async (EmailTo, EmailText,EmailHTML, EmailSubject) => {

    let transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: false,
        auth: {
            user: config.SMTP_USERNAME,
            pass: config.SMTP_PASSWORD
        },tls: {
            rejectUnauthorized: false
        },
    });

    let mailOptions = {
        from: 'Inventory Management System <info@developers.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText,
        html: EmailHTML
    };

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions)
        console.log('Message sent: %s', info.messageId);
        return info
        
      } catch (error) {
        console.error('Error occurred: ' + error.message);
      }
}
export {SendEmailUtility}