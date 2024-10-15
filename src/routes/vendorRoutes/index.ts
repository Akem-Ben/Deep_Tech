import express from 'express';
import { joiValidators } from '../../validations';
import { generalAuthFunction } from '../../middlewares/authorization.middleware';
import { vendorShopController } from '../../controllers/index';

const router = express.Router();

router.post('/create-shop', joiValidators.inputValidator(joiValidators.createShopSchema), generalAuthFunction, vendorShopController.createShop)

export default router;