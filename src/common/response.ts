import { Response } from 'express';

export const responseJson = (
  response: Response,
  code: number,
  status: string,
  message: string,
  data?: any,
) =>
  response.status(code).json({
    code,
    status,
    message,
    data,
  });

export const responseError = (
  response: Response,
  code: number,
  status: string,
  message: string,
  errors: any,
) =>
  response.status(code).json({
    code,
    status,
    message,
    errors,
  });
