import express, { Router } from 'express';
import PresenceController from './presence.controller';
import validation from '../../middleware/validation';
import authentication from '../../middleware/authentication';
import upload from '../../middleware/uploads';
import { addSchema } from './presence.dto';

const presenceController: PresenceController = new PresenceController();

export const presenceRouter: Router = express
    .Router()
    .get('/me', authentication, presenceController.getMyPresences)
    .get('/me/today', authentication, presenceController.getMyPresenceToday)
    .post('/', authentication, validation(addSchema), presenceController.add)
