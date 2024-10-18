import express from 'express';
import { joiValidators } from '../../validations';
import { generalAuthFunction, rolePermit } from '../../middlewares/authorization.middleware';
import { vendorShopController, vendorProductController } from '../../controllers/index';
import { cloudinaryUpload } from '../../utilities';
import { Roles } from '../../models/users/usersModel';

const router = express.Router();


//Shop Routes
router.post('/create-shop', cloudinaryUpload.single("displayImage"), joiValidators.inputValidator(joiValidators.createShopSchema), generalAuthFunction, vendorShopController.createShop)
router.put('/update-shop', generalAuthFunction, rolePermit([Roles.Vendor]), vendorShopController.updateShop)
router.get('/get-single-shop/:shopId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorShopController.getVendorSingleShop)
router.get('/get-all-shops', generalAuthFunction, rolePermit([Roles.Vendor]), vendorShopController.getAllVendorShops)
router.delete('/delete-single-shop/:shopId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorShopController.deleteSingleVendorShop)
router.delete('/delete-many-shops', generalAuthFunction, rolePermit([Roles.Vendor]), vendorShopController.deleteManyVendorShops)
router.get('/change-shop-status/:shopId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorShopController.changeVendorShopStatus)
router.put('/update-shop-image', generalAuthFunction, rolePermit([Roles.Vendor]), cloudinaryUpload.single("displayImage"), vendorShopController.updateShopImage)


//Product Routes
router.post('/create-product/:shopId', cloudinaryUpload.single("productImage"), joiValidators.inputValidator(joiValidators.createProductSchema), generalAuthFunction, rolePermit([Roles.Vendor]), vendorProductController.createProduct)
router.put('/update-product/:productId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorProductController.updateProduct)
router.get('/get-single-product/:productId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorProductController.vendorSingleProduct)
router.get('/get-all-products/:shopId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorProductController.allVendorProductsForAShop)
router.delete('/delete-single-product/:shopId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorProductController.deleteVendorSingleProduct)
router.delete('/delete-many-products/:shopId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorProductController.deleteManyVendorShopProducts)
router.put('/change-product-status/:productId', generalAuthFunction, rolePermit([Roles.Vendor]), vendorProductController.changeVendorProductStatus)
router.put('/update-product-image/:productId', generalAuthFunction, rolePermit([Roles.Vendor]), cloudinaryUpload.single("productImage"), vendorProductController.updateVendorProductImage)


export default router;