import dotenv from 'dotenv';

dotenv.config();

export const environment = {
    port: parseInt(process.env.PORT as string) || 3000,
    database_url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/presence',
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRESIN || '30d',
    },
    mail: {
        email: process.env.MAIL_EMAIL || 'admin@gmail.com',
        client_id: process.env.MAIL_CLIENT_ID || '1234',
        client_secret: process.env.MAIL_CLIENT_SECRET || '1234',
        redirect_uri: process.env.MAIL_REDIRECT_URI || 'https://google.com',
        refresh_token: process.env.MAIL_REFRESH_TOKEN || 'refresh_token',
    },
    gcp: {
        bucket: {
            name: process.env.GCP_BUCKET_NAME || 'BUCKET_NAME',
            key: process.env.GCP_KEY || 'KEY',
        },
    },
}