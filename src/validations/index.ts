import { NextFunction, Response } from 'express';
import joiValidators from './joi/joi.validations';
import Joi from 'joi';

export const requestBodyValidator = (schema: Joi.ObjectSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const { error } = schema.validate(request.body);
    if (error) {
      return response.status(400).json({
        status: 'error',
        message: `${error.details[0].message.replace(/["\\]/g, '')}`,
      });
    }
    next();
  };
};

export { joiValidators };
