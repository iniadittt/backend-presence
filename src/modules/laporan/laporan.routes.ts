import express, { Router } from 'express';
import LaporanController from './laporan.controller';
import validation from '../../middleware/validation';
import authentication from '../../middleware/authentication';
import { addSchema } from './laporan.dto';

const laporanController: LaporanController = new LaporanController();

export const laporanRouter: Router = express
    .Router()
    .get('/', authentication, laporanController.getAll)
    .get('/:id', authentication, laporanController.get)
    .post('/', authentication, validation(addSchema), laporanController.add)
    .delete('/:id', authentication, laporanController.delete)
