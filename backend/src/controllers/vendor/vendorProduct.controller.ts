import { Response } from "express";
import { vendorProductServices } from "../../services";
import { responseUtilities } from "../../utilities";
import { JwtPayload } from "jsonwebtoken";

const createProduct = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const userId = request.user._id;

  if (!userId) {
    return responseUtilities.responseHandler(response, "Unauthorized", 401);
  }

  const body = { ...request.body, userId };

  const product: any = await vendorProductServices.vendorCreateProductService(
    body,
    request
  );

  return responseUtilities.responseHandler(
    response,
    product.message,
    product.statusCode,
    product.data
  );
};

const updateProduct = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const userId = request.user._id;

  if (!userId) {
    return responseUtilities.responseHandler(response, "Unauthorized", 401);
  }

  const { productId } = request.params

  const updatedProduct = await vendorProductServices.updateProductService({
    ...request.body,
    userId,
    productId
  });

  return responseUtilities.responseHandler(
    response,
    updatedProduct.message,
    updatedProduct.statusCode,
    updatedProduct.data
  );
};

const vendorSingleProduct = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const { productId } = request.params;

  if (!productId) {
    return responseUtilities.responseHandler(
      response,
      "product ID is required",
      400
    );
  }

  const product = await vendorProductServices.getVendorSingleProduct({
    productId,
  });

  return responseUtilities.responseHandler(
    response,
    product.message,
    product.statusCode,
    product.data
  );
};

const allVendorProductsForAShop = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const user_id = request.user._id;

  const { shopId } = request.params;

  const { query } = request

  if (!user_id) {
    return responseUtilities.responseHandler(response, "Unauthorized", 400);
  }

  if (!shopId) {
    return responseUtilities.responseHandler(
      response,
      "Shop ID is required",
      400
    );
  }

  const products = await vendorProductServices.getAllVendorProductsForAShop(
    {shopId, query}
  );

  return responseUtilities.responseHandler(
    response,
    products.message,
    products.statusCode,
    products.data
  );
};

const deleteVendorSingleProduct = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const userId = request.user._id;

  if (!userId) {
    return responseUtilities.responseHandler(response, "Unauthorized", 401);
  }

  const result = await vendorProductServices.deleteSingleVendorProduct({
    ...request.body,
    userId,
  });

  return responseUtilities.responseHandler(
    response,
    result.message,
    result.statusCode
  );
};

const deleteManyVendorShopProducts = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const userId = request.user._id;

  if (!userId) {
    return responseUtilities.responseHandler(response, "Unauthorized", 401);
  }

  const result = await vendorProductServices.deleteManyVendorProductsForAShop({
    ...request.body,
    userId,
  });

  return responseUtilities.responseHandler(
    response,
    result.message,
    result.statusCode
  );
};

const changeVendorProductStatus = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const userId = request.user._id;

  if (!userId) {
    return responseUtilities.responseHandler(response, "Unauthorized", 400);
  }

  const result =
    await vendorProductServices.vendorDeactivateOrReactivateProduct({
      ...request.body,
      userId,
    });

  return responseUtilities.responseHandler(
    response,
    result.message,
    result.statusCode
  );
};

const updateVendorProductImage = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const user_id = request.user._id;

  if (!user_id) {
    return responseUtilities.responseHandler(response, "Unauthorized", 401);
  }

  const updatedProductImage = await vendorProductServices.updateProductImage(
    request
  );

  return responseUtilities.responseHandler(
    response,
    updatedProductImage.message,
    updatedProductImage.statusCode,
    updatedProductImage.data
  );
};

export default {
  createProduct,
  updateProduct,
  vendorSingleProduct,
  allVendorProductsForAShop,
  deleteVendorSingleProduct,
  deleteManyVendorShopProducts,
  changeVendorProductStatus,
  updateVendorProductImage,
};
