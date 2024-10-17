import {Request, Response} from 'express';
import { vendorShopService } from '../../services';
import { responseUtilities } from '../../utilities';
import { JwtPayload } from 'jsonwebtoken';

const createShop = async(request:JwtPayload, response:Response):Promise<any> => {

    const userId = request.user.id;

    if(!userId){
        return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }

    const body = {...request.body, userId}

    const shop:any = await vendorShopService.createVendorShopService(body, request)

    return responseUtilities.responseHandler(response, shop.message, shop.statusCode, shop.details, shop.data)
}

const updateShop = async (request: JwtPayload, response: Response): Promise<any> => {
    const user_id = request.user._id;
    
    if (!user_id) {
      return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }
  
    const { shopId, shopName, shopCategory, legalAddressOfBusiness } = request.body;
  
    const updatePayload = {
      userId: user_id,
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
      updatedShop.data
    );
  };

  
  const getVendorSingleShop = async (request: JwtPayload, response: Response): Promise<any> => {
    const { shopId } = request.params;
    
    if (!shopId) {
      return responseUtilities.responseHandler(response, 'Shop ID is required', 400);
    }
  
    const shop = await vendorShopService.getVendorSingleShop({ shopId });
  
    return responseUtilities.responseHandler(
      response, 
      shop.message, 
      shop.statusCode, 
      shop.data
    );
  };

  const getAllVendorShops = async (request: JwtPayload, response: Response): Promise<any> => {
    const user_id = request.user._id;
  
    if (!user_id) {
      return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }
  
    const shops = await vendorShopService.getAllVendorShops({ userId: user_id });
  
    return responseUtilities.responseHandler(
      response, 
      shops.message, 
      shops.statusCode, 
      shops.data
    );
  };

  const deleteSingleVendorShop = async (request: JwtPayload, response: Response): Promise<any> => {
    const user_id = request.user._id;
    const { shopId } = request.params;
  
    if (!user_id) {
      return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }
  
    const deleteDetails = {
      userId: user_id,
      shopId,
    };
  
    const result = await vendorShopService.deleteSingleVendorShop(deleteDetails);
  
    return responseUtilities.responseHandler(
      response, 
      result.message, 
      result.statusCode
    );
  };

  const deleteManyVendorShops = async (request: JwtPayload, response: Response): Promise<any> => {
    const user_id = request.user._id;
    const { shopIds } = request.body;
  
    if (!user_id) {
      return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }
  
    const deleteDetails = {
      userId: user_id,
      shopIds,
    };
  
    const result = await vendorShopService.deleteManyVendorShops(deleteDetails);
  
    return responseUtilities.responseHandler(
      response, 
      result.message, 
      result.statusCode
    );
  };
  
  const changeVendorShopStatus = async (request: JwtPayload, response: Response): Promise<any> => {
    const userId = request.user._id;
    const { shopId } = request.params;

  if (!userId) {
    return responseUtilities.responseHandler(response, 'Unauthorized', 401);
  }

  const deactivateDetails = {
    userId,
    shopId
  };

  const result = await vendorShopService.vendorDeactivateOrReactivateShop(deactivateDetails);

  return responseUtilities.responseHandler(
    response, 
    result.message, 
    result.statusCode,
    result.data
  );
  }


  const updateShopImage = async (request: JwtPayload, response: Response): Promise<any> => {
    const user_id = request.user._id;
    
    if (!user_id) {
      return responseUtilities.responseHandler(response, 'Unauthorized', 401);
    }
  
    const updatedShopImage = await vendorShopService.updateShopImage(request);
  
    return responseUtilities.responseHandler(
      response, 
      updatedShopImage.message, 
      updatedShopImage.statusCode, 
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