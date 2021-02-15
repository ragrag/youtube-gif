import { NextFunction, Request, Response } from 'express';

import { isBoom, Boom } from '@hapi/boom';
import { logger } from '../../common/utils/logger';

function errorMiddleware(error: Boom | Error, req: Request, res: Response, next: NextFunction) {
  console.log(error);
  const statusCode: number = isBoom(error) ? error.output.statusCode : 500;
  const errorMessage: string = isBoom(error) ? error.message : 'Something went wrong';
  logger.error(`StatusCode : ${statusCode}, Message : ${error}`);

  return res.status(statusCode).json({ message: errorMessage });
}
export default errorMiddleware;
