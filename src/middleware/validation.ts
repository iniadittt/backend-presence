import { z, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { responseError } from '../common/response';

const validation =
    (schema: z.ZodObject<any, any>) =>
        (request: Request, response: Response, next: NextFunction) => {
            try {
                schema.parse(request.body);
                next();
            } catch (error: any) {
                if (error instanceof ZodError) {
                    const errorMessages = error.errors.map((issue: any) => ({
                        message: `${issue.path.join('.')} is ${issue.message}`,
                    }));
                    return responseError(
                        response,
                        406,
                        'Not acceptable',
                        'Data yang dikirimkan oleh user tidak valid',
                        errorMessages,
                    );
                } else {
                    return responseError(
                        response,
                        500,
                        'Internal server error',
                        'Terjadi kesalahan pada server',
                        error.message,
                    );
                }
            }
        };

export default validation;
