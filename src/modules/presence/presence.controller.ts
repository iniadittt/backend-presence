import { Response } from 'express';
import { responseJson, responseError } from '../../common/response';
import prisma from '../../common/prismaclient';
import { AddBody } from './presence.interface';
import { Presence, PresenceStatus, Notification, Role, User } from '@prisma/client';
import { dataNotification } from '../../libs/dataNotification';

export default class PresenceController {
    constructor() { }

    async getMyPresences(request: any, response: Response) {
        try {
            const id: number | undefined = request.user?.id;
            if (!id) return responseJson(response, 400, 'Bad request', 'User tidak ditemukan')
            const presences: Presence[] | [] = await prisma.presence.findMany({
                where: {
                    userId: id,
                },
                orderBy: {
                    time: 'desc'
                }
            });
            if (presences.length == 0) return responseJson(response, 404, 'Not found', 'Data presensi tidak ditemukan')
            return responseJson(response, 200, 'Success', 'Mengambil data presensi', {
                presences: presences.map((presence: Presence) => {
                    const { userId, ...data } = presence;
                    return data;
                })
            })
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }

    async getMyPresenceToday(request: any, response: Response) {
        try {
            const id: number | undefined = request.user?.id;
            if (!id) return responseJson(response, 400, 'Bad request', 'User tidak ditemukan')
            const todayUTC: Date = new Date();
            const currentUTCOffsetInMilliseconds = todayUTC.getTimezoneOffset() * 60 * 1000;
            const utcPlus7OffsetInMilliseconds = 7 * 60 * 60 * 1000;
            const todayInUTCPlus7: Date = new Date(todayUTC.getTime() + currentUTCOffsetInMilliseconds + utcPlus7OffsetInMilliseconds);
            const startOfDay = new Date(todayInUTCPlus7.getFullYear(), todayInUTCPlus7.getMonth(), todayInUTCPlus7.getDate(), 0, 0, 0, 0)
            const endOfDay = new Date(todayInUTCPlus7.getFullYear(), todayInUTCPlus7.getMonth(), todayInUTCPlus7.getDate(), 23, 59, 59, 999)
            const presences: Presence[] | [] = await prisma.presence.findMany({
                where: {
                    userId: id,
                    time: {
                        gte: startOfDay,
                        lt: endOfDay
                    }
                }
            });
            if (presences.length === 0) return responseJson(response, 404, 'Not Found', 'Data presensi hari ini tidak ada');
            return responseJson(response, 200, 'Success', 'Mengambil data presensi', {
                presences: presences.map((presence: Presence) => {
                    const { userId, ...data } = presence;
                    return data;
                })
            });
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }

    async add(request: any, response: Response) {
        try {
            const { lat, long, imageUrl, note }: AddBody = request.body;
            const id: number | undefined = request.user?.id;
            if (!id) return responseJson(response, 400, 'Bad request', 'User tidak ditemukan')
            const todayUTC: Date = new Date();
            const currentUTCOffsetInMilliseconds = todayUTC.getTimezoneOffset() * 60 * 1000;
            const utcPlus7OffsetInMilliseconds = 7 * 60 * 60 * 1000;
            const todayInUTCPlus7: Date = new Date(todayUTC.getTime() + currentUTCOffsetInMilliseconds + utcPlus7OffsetInMilliseconds);
            const startOfDay = new Date(todayInUTCPlus7.getFullYear(), todayInUTCPlus7.getMonth(), todayInUTCPlus7.getDate(), 0, 0, 0, 0)
            const endOfDay = new Date(todayInUTCPlus7.getFullYear(), todayInUTCPlus7.getMonth(), todayInUTCPlus7.getDate(), 23, 59, 59, 999)
            const presences: Presence[] | [] = await prisma.presence.findMany({
                where: {
                    userId: id,
                    time: {
                        gte: startOfDay,
                        lt: endOfDay
                    }
                }
            });
            if (presences.length >= 2) return responseJson(response, 400, 'Bad request', 'User sudah melakukan semua presensi hari ini')
            const status = presences.length === 0 ? PresenceStatus.masuk : PresenceStatus.keluar
            const createdPresence: Presence = await prisma.presence.create({
                data: {
                    userId: id,
                    lat,
                    long,
                    status,
                    photo: imageUrl,
                    time: todayInUTCPlus7,
                    note
                }
            });
            if (!createdPresence) return responseJson(response, 500, 'Internal server error', 'Terjadi kersalahan pada server')
            const addNotification: Notification = await prisma.notification.create({ data: { title: status ? dataNotification.presence.add.masuk.title : dataNotification.presence.add.keluar.title, description: status ? dataNotification.presence.add.masuk.description : dataNotification.presence.add.keluar.description, userId: id, createdAt: todayInUTCPlus7 } })
            if (!addNotification) return responseJson(response, 500, 'Internal server error', 'Terjadi kesalahan pada server')
            return responseJson(response, 200, 'Success', `Presensi ${status} berhasil`);
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }

    async getPresences(request: any, response: Response) {
        try {
            const user: User | undefined = request.user;
            if (!user || user.role !== Role.admin) return responseJson(response, 403, 'Forbidden', 'User tidak memiliki akses')
            const presences = await prisma.presence.findMany({
                orderBy: {
                    time: 'desc'
                },
                include: {
                    user: true
                }
            });
            if (presences.length == 0) return responseJson(response, 404, 'Not found', 'Data presensi tidak ditemukan')
            return responseJson(response, 200, 'Success', 'Mengambil data presensi', {
                presences: presences.map((presence) => {
                    const { userId, user, ...data } = presence;
                    return { ...data, user: { email: user.email, name: user.name, role: user.role } };
                })
            })
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }
}