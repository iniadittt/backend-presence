import { Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../common/prismaclient';
import { responseJson, responseError } from '../common/response';
import { environment } from '../common/environment';
import { CustomJwtPayload } from '../common/interface';

const authentication = async (
    request: any,
    response: Response,
    next: NextFunction,
) => {
    const authData: string | null = request.headers['authorization'];
    if (!authData) return responseJson(response, 401, 'Unauthorized', 'Token not provided');
    const parts: string[] = authData.split(' ');
    if (parts.length !== 2) return responseJson(response, 401, 'Unauthorized', 'Invalid token format');
    const [scheme, token]: string[] = parts;
    if (scheme !== 'Bearer') return responseJson(response, 401, 'Unauthorized', 'Invalid token format');
    if (!token) return responseJson(response, 401, 'Unauthorized', 'Invalid token format');
    try {
        const decoded = jwt.verify(token, environment.jwt.secret) as CustomJwtPayload;
        const user: User | null = await prisma.user.findUnique({ where: { email: decoded.email, active: true } });
        if (!user) return responseJson(response, 401, 'Unauthorized', 'Unauthorized');
        const matchToken: boolean = user.token === token;
        if (!matchToken) return responseJson(response, 401, 'Unauthorized', 'Unauthorized');
        request.user = user;
        next();
    } catch (error: any) {
        return responseJson(response, 401, 'Unauthorized', error.message);
    }
};

export default authentication;
