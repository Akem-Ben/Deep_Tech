import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/


const inputValidator = (schema: Joi.Schema):any => {
    return async (request: Request, response: Response, next: NextFunction):Promise<any> => {
      try {
        const { error } = schema.validate(request.body);
        if (error) {
          return response.status(400).json({
            status: 'error',
            message: `${error.details[0].message.replace(/["\\]/g, '')}`,
          });
        }
        return next(); // Ensure next is called if no error
      } catch (err) {
        return response.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    };
  };


const userRegisterSchemaViaEmail = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(8).pattern(PASSWORD_PATTERN).required().messages({
    'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.'
  }),
  name: Joi.string().required(),
  phone: Joi.string().required()
});


const loginUserSchemaViaEmail = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

const cartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().positive().required()
});

// const facebookLoginSchema = Joi.object({
//   facebookId: Joi.string().required().email()
// })

// const resetPasswordInitiationSchema = Joi.object({
//   email: Joi.string().required().email()
// })

// const resetPassword = Joi.object({
//   password: Joi.string().min(8).pattern(PASSWORD_PATTERN).required().messages({
//     'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.'
//   }),
//   token: Joi.string().required()
// })

// const instagramAuthSchema = Joi.object({
//   instagram_user_name: Joi.string().required(),
//   instagram_id: Joi.string().required(),
//   instagram_account_type: Joi.string().optional(),
//   short_lived_token: Joi.string().optional(),
//   long_lived_token: Joi.string().required(),
//   token_expiry_date: Joi.date().required()
// })

export default {
  userRegisterSchemaViaEmail,
  loginUserSchemaViaEmail,
  cartSchema,
//   facebookAuthSchema,
//   facebookLoginSchema,
//   resetPasswordInitiationSchema,
//   resetPassword,
//   instagramAuthSchema,
  inputValidator
}