import express from 'express';
import { joiValidators } from '../../validations';
import { generalAuthFunction } from '../../middlewares/authorization.middleware';
import { vendorShopController } from '../../controllers/index';
import { cloudinaryUpload } from '../../utilities/';

const router = express.Router();

router.post('/create-shop', joiValidators.inputValidator(joiValidators.createShopSchema), generalAuthFunction, cloudinaryUpload.single("displayImage"), vendorShopController.createShop)
router.put('/update-shop', generalAuthFunction, vendorShopController.updateShop)
router.get('/get-single-shop/:shopId', generalAuthFunction, vendorShopController.getVendorSingleShop)
router.get('/get-all-shops', generalAuthFunction, vendorShopController.getAllVendorShops)
router.delete('/delete-single-shop/:shopId', generalAuthFunction, vendorShopController.deleteSingleVendorShop)
router.delete('/delete-many-shops', generalAuthFunction, vendorShopController.deleteManyVendorShops)
router.post('/deactivate-shop/:shopId', generalAuthFunction, vendorShopController.changeVendorShopStatus)
router.put('/update-shop-image', generalAuthFunction, cloudinaryUpload.single("displayImage"), vendorShopController.updateShopImage)

export default router;