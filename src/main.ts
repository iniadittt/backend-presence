import express, { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import prisma from './common/prismaclient';
import { environment } from './common/environment';
import { authRouter, userRouter } from './modules/user/user.routes';
import { presenceRouter } from './modules/presence/presence.routes';
import { responseError, responseJson } from './common/response';
import { bucketName, GCS } from './common/gcs';
import { laporanRouter } from './modules/laporan/laporan.routes';
import authentication from './middleware/authentication';
import upload from './middleware/uploads';
import { Notification } from '@prisma/client';

const app: Express = express();
const port: number = environment.port;

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }),
);
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/presences', presenceRouter);
app.use('/api/reports', laporanRouter);

app.get('/', (request: Request, response: Response) => responseJson(response, 200, 'Success', 'API Presence'));

app.post('/api/upload', authentication, upload.single('image'), async (request: any, response: Response) => {
    try {
        const id: number = parseInt(request.user?.id as string);
        if (!id) return responseJson(response, 401, 'Unauthorized', 'Unauthorized');
        const file: Express.Multer.File | undefined = request.file
        if (!file) return responseJson(response, 400, 'Bad request', 'File not found');
        const filepath: string = file.path
        const fileName: string = path.basename(filepath)
        const destFileName = `presence/${fileName}`
        await GCS.bucket(bucketName).upload(filepath, { destination: destFileName })
        const url: string = `https://storage.googleapis.com/${bucketName}/${destFileName}`
        fs.unlinkSync(filepath);
        return responseJson(response, 200, 'Success', 'Upload image berhasil', { url });
    } catch (error: any) {
        return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
    }
});

app.get('/api/notifications', authentication, async (request: any, response: Response) => {
    try {
        const id: number = parseInt(request.user?.id as string)
        if (!id) return responseJson(response, 400, 'Bad request', 'User tidak ditemukan');
        const notifications: Notification[] | [] = await prisma.notification.findMany({
            where: {
                userId: id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (notifications.length === 0) return responseJson(response, 400, 'Bad request', 'Data notifications tidak ada');
        const updateAllStatus = await prisma.notification.updateMany({
            where: {
                userId: id,
            },
            data: {
                read: true
            },
        });
        if (!updateAllStatus || !updateAllStatus.count) return responseJson(response, 500, 'Internal server error', 'Terjadi kesalahan pada server');
        return responseJson(response, 200, 'Success', 'Mengambil data notifications berhasil', {
            notifications: notifications.map((notification: Notification) => {
                const { userId, ...data } = notification
                return data
            })
        });
    } catch (error: any) {
        return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
    }
});

app.all('*', (request: Request, response: Response) => responseJson(response, 404, 'Not found', 'Not found'))

app.listen(port, () => console.log(`[SERVER] running at http://localhost:${port}`));