import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
if (process.env.NODE_ENV !== 'production') {
    const envPath = path.resolve(fileURLToPath(import.meta.url), '../../.env');
    console.log(envPath)
    config({ path: envPath});
}

export const transport = createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'shivanshkothari.testing@gmail.com',
        pass: process.env.BREVO_KEY
    }
});

export const sendOTP = async (userEmail, OTP) => {
    
    const mailOptions = {
        from: 'shivanshkothari.testing@gmail.com',
        to: userEmail,
        subject: 'OTP | My Vedic Journey'
        ,
        text:
        `Welcome to My Vedic Journey!
        
        Your OTP is ${OTP}. OTP will expire in 120 seconds.
        Do not disclose this to anyone else.



        Hoping you a bright journey ahead,

        Moderator team
        My Vedic Journey
        `
    };

    transport.sendMail(mailOptions)
    .then(info => {
        console.log("OTP sent: " + info.response);

    });
}

export const sendSignupLink = async (userEmail, SIGNUP_LINK) => {
    const mailOptions = {
        from: 'shivanshkothari.testing@gmail.com',
        to: userEmail,
        subject: 'Signup Link | My Vedic Journey'
        ,
        text:
        `Thanks a lot for waiting!
        Here is your one-time Signup link ${SIGNUP_LINK}.
        
        This will be destroyed as soon as an account is created through it. So please be mindful to not share this link with others.


        
        Hoping you a bright journey ahead,

        Moderator team
        My Vedic Journey
        `
    };

    transport.sendMail(mailOptions)
    .then(info => {
        res.send("Email sent: " + info.response);

    });
}

export const sendApprovalNotification = async (userEmail, postTitle, postUrl) => {
    try {
        const mailOptions = {
            from: 'shivanshkothari.testing@gmail.com',
            to: userEmail,
            subject: 'Blog Post Approved | My Vedic Journey',
            text: `Your blog post "${postTitle}" has been reviewed and approved. It is now live on the site.

You can view your post at: ${process.env.SITE_URL}/${postUrl}

Thank you for contributing to our blog!

Best regards,
Moderator Team
My Vedic Journey`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #000000; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; color: #D65D0E;">Om</h1>
                    </div>
                    
                    <div style="padding: 20px; background-color: #fff;">
                        <h2 style="color: #D65D0E;">Blog Post Approval Notification</h2>
                        <p>Your blog post "<strong>${postTitle}</strong>" has been reviewed and approved. It is now live on the site.</p>
                        <p>You can view your post at: <a href="${process.env.SITE_URL}/${postUrl}" style="color: #D65D0E;">${process.env.SITE_URL}/${postUrl}</a></p>
                        <p>Thank you for contributing to our blog!</p>
                        <br/>
                        <p>Best regards,<br/>Moderator Team<br/><strong>My Vedic Journey</strong></p>
                    </div>

                    <div style="background-color: #D65D0E; color: white; padding: 20px; text-align: center; font-size: 12px;">
                        <p>&copy; My Vedic Journey</p>
                        <div>
                            <a href="https://github.com/yourgithub" style="color: white; text-decoration: none; margin: 0 10px;">GitHub</a>
                            <a href="https://instagram.com/yourinstagram" style="color: white; text-decoration: none; margin: 0 10px;">Instagram</a>
                            <a href="https://youtube.com/yourchannel" style="color: white; text-decoration: none; margin: 0 10px;">YouTube</a>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transport.sendMail(mailOptions);
        console.log("Approval notification sent:", info.response);
        return true;
    } catch (error) {
        console.error("Error sending approval notification:", error);
        throw error;
    }
};