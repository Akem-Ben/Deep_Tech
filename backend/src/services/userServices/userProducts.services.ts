import { errorUtilities } from "../../utilities";
import { productDatabase, shopDatabase } from "../../helpers";
import { ResponseDetails } from "../../types/utilities.types";
import { queryFilter } from "../../helpers/generalHelpers/generalHelpers.helpers";



const getAllProducts = errorUtilities.withErrorHandling(
    async (queryDetails: Record<string, any>): Promise<any> => {
  
      const responseHandler: ResponseDetails = {
        statusCode: 0,
        message: "",
      };
  
      const query = await queryFilter(queryDetails.query || {});
  
      const size = Number(queryDetails.query.size) || 10;
      
      const skip = (Number(queryDetails.query.page) - 1) * size || 0;
  
      const filter = {
        ...query,
        isAvailable: true,
        isBlacklisted: false
      };
  
      const options = {
        skip,
        limit: size,
        sort: { numberOfSales: -1 }
      };
  
      const projection = {
        productName: 1,
        productCategory: 1,
        shopId: 1,
        cost: 1,
        availableQuantity: 1,
        isAvailable: 1,
        productImage: 1,
        numberOfSales: 1,
        ratings: 1,
        isBlacklisted: 1
      };
  
      const products = await productDatabase.getMany(filter, projection, options);
  
      if (!products || products.length === 0) {
        throw errorUtilities.createError(
          "No Products found.",
          404
        );
      }
  
      responseHandler.statusCode = 200;
      responseHandler.message = "products fetched successfully";
      responseHandler.data = {
          products,
      };
      return responseHandler;
    }
);

const getAllProductsForAShop = errorUtilities.withErrorHandling(
    async (queryDetails: Record<string, any>): Promise<any> => {
  
      const responseHandler: ResponseDetails = {
        statusCode: 0,
        message: "",
      };
  
      const query = await queryFilter(queryDetails.query || {});
  
      const size = Number(queryDetails.query.size) || 10;
      
      const skip = (Number(queryDetails.query.page) - 1) * size || 0;
  
      const { shopId } = queryDetails;
  
      const filter = {
        ...query,
        shopId,
        isAvailable: true,
        isBlacklisted: false
      };
  
      const options = {
        skip,
        limit: size,
      };
  
      const projection = {
        productName: 1,
        productCategory: 1,
        shopId: 1,
        cost: 1,
        availableQuantity: 1,
        isAvailable: 1,
        productImage: 1,
        numberOfSales: 1,
        ratings: 1,
        isBlacklisted: 1
      };
  
      const products = await productDatabase.getMany(filter, projection, options);
  
      if (!products || products.length === 0) {
        throw errorUtilities.createError(
          "No Products found",
          404
        );
      }
  
      responseHandler.statusCode = 200;
      responseHandler.message = "products fetched successfully";
      responseHandler.data = {
          products,
      };
      return responseHandler;
    }
);


const getSingleProduct = errorUtilities.withErrorHandling(

    async (queryDetails: Record<string, any>): Promise<any> => {
  
      const responseHandler: ResponseDetails = {
        statusCode: 0,
        message: "",
      };
  
      const { productId } = queryDetails;
  
      const product = await productDatabase.getOne(
        { _id: productId },
        {
            productName: 1,
            productCategory: 1,
            shopId: 1,
            cost: 1,
            availableQuantity: 1,
            isAvailable: 1,
            productImage: 1,
            numberOfSales: 1,
            ratings: 1,
            isBlacklisted: 1
        }
      );
  
      if (!product) {
        throw errorUtilities.createError(
          "Product not found",
          404
        );
      }
  
      responseHandler.statusCode = 200;
      responseHandler.message = "Product fetched successfully";
      responseHandler.data = {
          product,
      };
      return responseHandler;
    }
);

const getAllShops = errorUtilities.withErrorHandling(
    async (queryDetails: Record<string, any>): Promise<any> => {
      const responseHandler: ResponseDetails = {
        statusCode: 0,
        message: "",
      };

  
      const query = await queryFilter(queryDetails.query || {});
  
      const size = Number(queryDetails.query.size) || 10;
      
      const skip = (Number(queryDetails.query.page) - 1) * size || 0;
  
      const filter = {
        ...query,
        isActive: true,
        isBlacklisted: false
      };
  
      const options = {
        skip,
        limit: size,
        sort: { numberOfSales: -1 }
      };

      const projection = {
        shopName: 1,
        businessLegalName: 1,
        businessLicenseNumber: 1,
        shopCategory: 1,
        legalAddressOfBusiness: 1,
        isBlacklisted: 1,
        ownerId: 1,
        displayImage: 1,
        noOfProducts: 1,
        isActive: 1
      }

      const shops = await shopDatabase.getMany(filter, projection, options);
  
      if (!shops || shops.length === 0) {
        throw errorUtilities.createError(
          "No shops found",
          404
        );
      }
  
      responseHandler.statusCode = 200;
      responseHandler.message = "Shops fetched successfully";
      responseHandler.data = {
        shops,
      };
      return responseHandler;
    }
);




export default {
    getAllProducts,
    getAllProductsForAShop,
    getSingleProduct,
    getAllShops,
}