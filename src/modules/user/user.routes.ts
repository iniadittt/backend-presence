import express, { Router } from 'express';
import UserController from './user.controller';
import validation from '../../middleware/validation';
import authentication from '../../middleware/authentication';
import { loginSchema, registerSchema, verifySchema, getTokenSchema, updateProfileSchema, updatePasswordSchema, addUserSchema, updateUserSchema, updatePasswordUserSchema } from './user.dto';

const userController: UserController = new UserController();

export const authRouter: Router = express
    .Router()
    .post('/login', validation(loginSchema), userController.login)
    .post('/register', validation(registerSchema), userController.register)
    .post('/verify', validation(verifySchema), userController.verify)
    .get('/otp', validation(getTokenSchema), userController.getOtp)

export const userRouter: Router = express
    .Router()
    .get('/', authentication, userController.getUsers)
    .get('/:id', authentication, userController.getUser)
    .post('/', authentication, validation(addUserSchema), userController.addUser)
    .put('/:id', authentication, validation(updateUserSchema), userController.updateUser)
    .put('/:id', authentication, validation(updatePasswordUserSchema), userController.updatePasswordUser)
    .delete('/:id', authentication, userController.deleteUser)
    .get('/me', authentication, userController.getMyProfile)
    .put('/me', authentication, validation(updateProfileSchema), userController.updateMyProfile)
    .put('/me/password', authentication, validation(updatePasswordSchema), userController.updateMyPassword)

