import { Response } from "express";
import { userProductsService } from "../../services";
import { responseUtilities } from "../../utilities";
import { JwtPayload } from "jsonwebtoken";


const userGetAllProducts = async (
    request: JwtPayload,
    response: Response
  ): Promise<any> => {

    const { query } = request;
  
    const products = await userProductsService.getAllProducts({query});
  
    return responseUtilities.responseHandler(
      response,
      products.message,
      products.statusCode,
      products.data
    );
  };
  
const allProductsForAShop = async (
    request: JwtPayload,
    response: Response
  ): Promise<any> => {
  
    const { shopId } = request.params;
  
    const { query } = request
  
    if (!shopId) {
      return responseUtilities.responseHandler(
        response,
        "Shop ID is required",
        400
      );
    }
  
    const products = await userProductsService.getAllProductsForAShop(
      {shopId, query}
    );
  
    return responseUtilities.responseHandler(
      response,
      products.message,
      products.statusCode,
      products.data
    );
  };


const getASingleProduct = async (request: JwtPayload, response: Response): Promise<any> => {
    const { productId } = request.params;
    
    if (!productId) {
      return responseUtilities.responseHandler(response, 'Product Id not provided, Please try again or contact admin', 400);
    }
  
    const shop = await userProductsService.getSingleProduct({ productId });
  
    return responseUtilities.responseHandler(
      response, 
      shop.message, 
      shop.statusCode, 
      shop.data
    );
  };

const getAllAvailableShops = async (request: JwtPayload, response: Response): Promise<any> => {
    
    const { query } = request;
  
    const shops = await userProductsService.getAllShops(query);
  
    return responseUtilities.responseHandler(
      response, 
      shops.message, 
      shops.statusCode, 
      shops.data
    );
  };


export default {
    userGetAllProducts,
    allProductsForAShop,
    getASingleProduct,
    getAllAvailableShops
}