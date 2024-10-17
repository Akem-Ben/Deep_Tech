import express from 'express';
import { joiValidators } from '../../validations';
import { userAuthController, cartController, userProductControllers } from '../../controllers';
import { generalAuthFunction } from '../../middlewares/authorization.middleware';

const router = express.Router();

//User Email Authentications
router.post('/email-signup', joiValidators.inputValidator(joiValidators.userRegisterSchemaViaEmail), userAuthController.userRegisterWithEmail)
router.post('/email-login', joiValidators.inputValidator(joiValidators.loginUserSchemaViaEmail), userAuthController.userLoginWithEmail)
router.get('/verification/:token', userAuthController.userVerifiesAccountWithEmail)
router.post('/resend-verification-link', userAuthController.userResendsVerificationLink)


//User Cart Operations
router.post('/add-cart-item', joiValidators.inputValidator(joiValidators.cartSchema), generalAuthFunction, cartController.addItemToCart)
router.put('/update-cart-item', joiValidators.inputValidator(joiValidators.cartSchema), generalAuthFunction, cartController.updateItemInCart)
router.delete('/delete-cart-item', joiValidators.inputValidator(joiValidators.cartItemDeleteSchema), generalAuthFunction, cartController.deleteItemFromCart)
router.get('/get-cart', generalAuthFunction, cartController.getCartItems)


//User Product and Shop Operations
router.get('/all-products', generalAuthFunction, userProductControllers.userGetAllProducts)
router.get('/all-shop-products/:shopId', generalAuthFunction, userProductControllers.allProductsForAShop)
router.get('/single-product/:productId', generalAuthFunction, userProductControllers.getASingleProduct)
router.get('/all-shops', generalAuthFunction, userProductControllers.getAllAvailableShops)


export default router;