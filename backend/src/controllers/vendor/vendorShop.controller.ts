import {Request, Response} from 'express';
import { vendorShopService } from '../../services';
import { responseUtilities } from '../../utilities';
import { JwtPayload } from 'jsonwebtoken';

const createShop = async(request:JwtPayload, response:Response):Promise<any> => {

    const userId = request.user.id;

    const body = {...request.body, userId}

    const shop:any = await vendorShopService.createVendorShopService(body, request)

    if(shop.accessToken){
      response
      .header("x-access-token", shop.data.accessToken)
      .header("x-refresh-token", shop.data.refreshToken);
    }

    return responseUtilities.responseHandler(response, shop.message, shop.statusCode, shop.details, shop.data)
}

const updateShop = async (request: JwtPayload, response: Response): Promise<any> => {
    const userId = request.user.id;
  
    const { shopId, shopName, shopCategory, legalAddressOfBusiness } = request.body;
  
    const updatePayload = {
      userId: userId,
      shopId,
      shopName,
      shopCategory,
      legalAddressOfBusiness,
    };
  
    const updatedShop = await vendorShopService.updateShopService(updatePayload);
  
    return responseUtilities.responseHandler(
      response, 
      updatedShop.message, 
      updatedShop.statusCode, 
      updatedShop.details,
      updatedShop.data
    );
  };

  
  const getVendorSingleShop = async (request: JwtPayload, response: Response): Promise<any> => {
    const { shopId } = request.params;
  
    const shop = await vendorShopService.getVendorSingleShop({ shopId });
  
    return responseUtilities.responseHandler(
      response, 
      shop.message, 
      shop.statusCode,
      shop.details,
      shop.data
    );
  };

  const getAllVendorShops = async (request: JwtPayload, response: Response): Promise<any> => {
    const user_id = request.user.id;
  
    const shops = await vendorShopService.getAllVendorShops({ userId: user_id });
  
    return responseUtilities.responseHandler(
      response, 
      shops.message, 
      shops.statusCode,
      shops.details,
      shops.data
    );
  };

  const deleteSingleVendorShop = async (request: JwtPayload, response: Response): Promise<any> => {

    const user_id = request.user.id;

    const { shopId } = request.params;
  
    const deleteDetails = {
      userId: user_id,
      shopId,
    };
  
    const result = await vendorShopService.deleteSingleVendorShop(deleteDetails);
  
    return responseUtilities.responseHandler(
      response, 
      result.message, 
      result.statusCode,
      result.details,
      result.data
    );
  };

  const deleteManyVendorShops = async (request: JwtPayload, response: Response): Promise<any> => {

    const user_id = request.user.id;

    const { shopIds } = request.body;
  
    const deleteDetails = {
      userId: user_id,
      shopIds,
    };
  
    const result = await vendorShopService.deleteManyVendorShops(deleteDetails);
  
    return responseUtilities.responseHandler(
      response, 
      result.message,
      result.statusCode,
      result.details,
      result.data
    );
  };
  
  const changeVendorShopStatus = async (request: JwtPayload, response: Response): Promise<any> => {
    const userId = request.user.id;
    const { shopId } = request.params;

  const shopStatusChangeDetails = {
    userId,
    shopId
  };

  const result = await vendorShopService.vendorDeactivateOrReactivateShop(shopStatusChangeDetails);

  return responseUtilities.responseHandler(
    response, 
    result.message, 
    result.statusCode,
    result.details,
    result.data
  );
  }


  const updateShopImage = async (request: JwtPayload, response: Response): Promise<any> => {
  
    const updatedShopImage = await vendorShopService.updateShopImage(request);
  
    return responseUtilities.responseHandler(
      response, 
      updatedShopImage.message, 
      updatedShopImage.statusCode,
      updatedShopImage.details,
      updatedShopImage.data
    );
  };

export default {
    createShop,
    updateShop,
    getVendorSingleShop,
    getAllVendorShops,
    deleteSingleVendorShop,
    deleteManyVendorShops,
    changeVendorShopStatus,
    updateShopImage
}