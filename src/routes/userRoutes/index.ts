import express from 'express';
import { joiValidators } from '../../validations';
import { userAuthController, cartController } from '../../controllers';
import { generalAuthFunction } from '../../middlewares/authorization.middleware';

const router = express.Router();

//User Email Authentications
router.post('/email-signup', joiValidators.inputValidator(joiValidators.userRegisterSchemaViaEmail), userAuthController.userRegisterWithEmail)
router.post('/email-login', joiValidators.inputValidator(joiValidators.loginUserSchemaViaEmail), userAuthController.userLoginWithEmail)

//User Cart Operations
router.post('/add-cart-item', joiValidators.inputValidator(joiValidators.cartSchema), generalAuthFunction, cartController.addItemToCart)
router.put('/update-cart-item', joiValidators.inputValidator(joiValidators.cartSchema), generalAuthFunction, cartController.updateItemInCart)
router.delete('/delete-cart-item', joiValidators.inputValidator(joiValidators.cartItemDeleteSchema), generalAuthFunction, cartController.deleteItemFromCart)


export default router;