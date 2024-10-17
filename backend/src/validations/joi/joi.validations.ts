import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/


const inputValidator = (schema: Joi.Schema):any => {
    return async (request: Request, response: Response, next: NextFunction):Promise<any> => {
      try {
        console.log('Request Body:', request.body);
        console.log('Using Schema:', schema.describe())
        const { error } = schema.validate(request.body);
        if (error) {
          return response.status(400).json({
            status: 'error',
            message: `${error.details[0].message.replace(/["\\]/g, '')}`,
          });
        }
        return next();
      } catch (err) {
        return response.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    };
  };

//User Auth
const userRegisterSchemaViaEmail = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(PASSWORD_PATTERN).required().messages({
    'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.'
  }),
  phone: Joi.string().required()
});


const loginUserSchemaViaEmail = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})


//Cart
const cartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().positive().required()
});

const cartItemDeleteSchema = Joi.object({
  productId: Joi.string().required()
})


//Shops & Products
const createShopSchema = Joi.object({
  shopName:  Joi.string().required(),
  businessLegalName: Joi.string().required(),
  businessLicenseNumber: Joi.string().required(),
  shopCategory: Joi.string().required(),
  legalAddressOfBusiness: Joi.string().required()
})


const createProductSchema = Joi.object({
    productName: Joi.string().required(),
    productCategory: Joi.string().required(),
    shopId: Joi.string().required(),
    cost: Joi.number().required(),
    availableQuantity: Joi.number().required(),

})

export default {
  userRegisterSchemaViaEmail,
  loginUserSchemaViaEmail,
  cartSchema,
  cartItemDeleteSchema,
  createShopSchema,
  createProductSchema,
  inputValidator
}