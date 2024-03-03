import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
if (process.env.NODE_ENV !== 'production') {
    const envPath = path.resolve(fileURLToPath(import.meta.url), '../../.env');
    console.log(envPath)
    config({ path: envPath});
}

const transport = createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: 'shivanshkothari.testing@gmail.com',
        pass: process.env.BREVO_KEY
    }
});

export const sendOTP = async (userEmail, OTP) => {
    // const transport = createTransport({
    //     host: 'smtp-relay.sendinblue.com',
    //     port: 587,
    //     auth: {
    //         user: 'shivanshkothari.testing@gmail.com',
    //         pass: 'xsmtpsib-09504187cd7859eeba0bbeb6d9e68fbb02068c89de07994899014dfae333fc5f-dt7Q2cWZqAO9v5Bx'
    //     }
    // });
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