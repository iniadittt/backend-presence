import { Response } from "express";
import { responseError, responseJson } from "../../common/response";
import prisma from "../../common/prismaclient";
import { Laporan, Notification } from "@prisma/client";
import { AddBody } from "./laporan.interface";
import { dataNotification } from '../../libs/dataNotification';

export default class LaporanController {
    constructor() { }

    async getAll(request: any, response: Response) {
        try {
            const reports: Laporan[] | [] = await prisma.laporan.findMany()
            if (reports.length === 0) return responseJson(response, 404, 'Not Found', 'Data laporan tidak ada')
            return responseJson(response, 200, 'Success', 'Mengambil data semua laporan berhasil', { reports });
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }

    async get(request: any, response: Response) {
        try {
            const id: number = parseInt(request.params.id as string)
            if (!id) return responseJson(response, 400, 'Bad request', 'ID Laporan dibutuhkan')
            const report: Laporan | null = await prisma.laporan.findUnique({ where: { id } })
            if (!report) return responseJson(response, 404, 'Not Found', 'Data laporan tidak ada')
            return responseJson(response, 200, 'Success', `Mengambil data laporan dengan id ${id} berhasil`, { report });
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }

    async add(request: any, response: Response) {
        try {
            const id: number | undefined = request.user?.id
            if (!id) return responseJson(response, 400, 'Bad request', 'User tidak ditemukan')
            const { title, description }: AddBody = request.body;
            const createdReport: Laporan = await prisma.laporan.create({
                data: {
                    title,
                    description,
                    userId: id
                }
            })
            if (!createdReport) return responseJson(response, 500, 'Internal server error', 'Terjadi kesalahan pada server')
            const addNotification: Notification = await prisma.notification.create({ data: { title: dataNotification.laporan.add.title, description: dataNotification.laporan.add.description, userId: id } })
            if (!addNotification) return responseJson(response, 500, 'Internal server error', 'Terjadi kesalahan pada server')
            return responseJson(response, 200, 'Success', 'Menyimpan data laporan berhasil');
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }

    async delete(request: any, response: Response) {
        try {
            const id: number = parseInt(request.params.id as string)
            if (!id) return responseJson(response, 400, 'Bad request', 'ID Laporan dibutuhkan')
            const report: Laporan | null = await prisma.laporan.findUnique({
                where: {
                    id: parseInt(request.params.id)
                }
            })
            if (!report) return responseJson(response, 404, 'Not Found', 'Data laporan tidak ada')
            const deleteReport: Laporan = await prisma.laporan.delete({ where: { id: parseInt(request.params.id) } })
            if (!deleteReport) return responseJson(response, 500, 'Internal server error', 'Terjadi kesalahan pada server')
            const addNotification: Notification = await prisma.notification.create({ data: { title: dataNotification.laporan.delete.title, description: dataNotification.laporan.delete.description, userId: id } })
            if (!addNotification) return responseJson(response, 500, 'Internal server error', 'Terjadi kesalahan pada server')
            return responseJson(response, 200, 'Success', `Menghapus data laporan dengan id ${id} berhasil`);
        } catch (error: any) {
            return responseError(response, 500, 'Internal server error', 'Terjadi kesalahan pada server', error.message);
        }
    }
}