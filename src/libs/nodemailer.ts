import { google } from "googleapis"
import { environment } from "../common/environment"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

console.log({ environment })
const oAuth2Client = new google.auth.OAuth2(
    environment.mail.client_id,
    environment.mail.client_secret,
    environment.mail.redirect_uri,
)

oAuth2Client.setCredentials({ refresh_token: environment.mail.refresh_token })

const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const { token: ACCESS_TOKEN } = await oAuth2Client.getAccessToken()
        if (!ACCESS_TOKEN) throw new Error("Failed to retrieve access token")
        const transportOptions: SMTPTransport.Options = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: environment.mail.email,
                clientId: environment.mail.client_id,
                clientSecret: environment.mail.client_secret,
                refreshToken: environment.mail.refresh_token,
                accessToken: ACCESS_TOKEN,
            },
            tls: {
                rejectUnauthorized: true,
            }
        }
        const transport = nodemailer.createTransport(transportOptions)
        const mailOptions = {
            from: `Presence Admin`,
            to,
            subject,
            html
        }
        const info = await transport.sendMail(mailOptions)
        return info
    } catch (err) {
        throw new Error(`Error sending email: ${err}`)
    }
}

export default sendEmail