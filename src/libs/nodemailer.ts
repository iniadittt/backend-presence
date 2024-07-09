import { google } from "googleapis"
import { environment } from "../common/environment"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

const oAuth2Client = new google.auth.OAuth2(
    environment.mail.client_id,
    environment.mail.client_secret,
    environment.mail.redirect_uri,
)

oAuth2Client.setCredentials({ refresh_token: environment.mail.refresh_token })

const sendEmail = async (to: string, subject: string, html: string) => {
    const ACCESS_TOKEN = await oAuth2Client.getAccessToken()
    const transportOptions: SMTPTransport.Options = {
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: environment.mail.email,
            clientId: environment.mail.client_id,
            clientSecret: environment.mail.client_secret,
            refreshToken: environment.mail.refresh_token,
            accessToken: ACCESS_TOKEN.token?.toString(),
        },
        tls: {
            rejectUnauthorized: true,
        }
    };
    const transport = nodemailer.createTransport(transportOptions);
    const mailOptions = {
        from: `Presence <${environment.mail.email}>`,
        to,
        subject,
        html
    }
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (err, info) => {
            console.log({ err, info })
            if (err) reject(err)
            resolve(info)
        })
    })
}

export default sendEmail