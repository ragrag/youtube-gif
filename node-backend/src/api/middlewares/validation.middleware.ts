import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';

const validationMiddleware = (type: any, value: string | 'body' | 'query' | 'params' = 'body', skipMissingProperties = false): RequestHandler => {
  return (req, res, next) => {
    validate(plainToClass(type, req[value]), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        res.status(400).send(message);
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
