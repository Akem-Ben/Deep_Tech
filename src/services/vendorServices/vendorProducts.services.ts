import { errorUtilities } from "../../utilities";
import { Request } from "express";
import { productDatabase, shopDatabase } from "../../helpers";
import { ResponseDetails } from "../../types/utilities.types";

const vendorCreateProductService = errorUtilities.withErrorHandling(
  async (
    createProductPayload: Record<string, any>,
    request: Request
  ): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const {
      productName,
      productCategory,
      shopId,
      cost,
      availableQuantity,
      userId,
    } = createProductPayload;

    const product = await productDatabase.getOne({
      productName: productName,
      shopId: shopId,
    });

    const shop = await shopDatabase.getOne({ _id: shopId });

    if (userId !== shop?.ownerId) {
      throw errorUtilities.createError("This is not your shop", 404);
    }

    if (!shop) {
      throw errorUtilities.createError(
        "You need to create a shop before you can create products",
        404
      );
    }

    if (product) {
      throw errorUtilities.createError(
        "You already have a product with this name in your shop",
        404
      );
    }

    const payload = {
      productName,
      productCategory,
      shopId,
      cost,
      availableQuantity,
      productImage: request?.file?.path,
    };

    const newProduct = await productDatabase.create(payload);

    const extractedProduct = await productDatabase.extractProductDetails(
      newProduct
    );

    responseHandler.statusCode = 201;
    responseHandler.message = "Product created successfully";
    responseHandler.data = {
      product: extractedProduct,
    };
    return responseHandler;
  }
);

const updateProductService = errorUtilities.withErrorHandling(

  async (updatePayload: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    if (
      (!updatePayload.productName || updatePayload.productName === "") &&
      (!updatePayload.productCategory || updatePayload.productCategory === "") &&
      ( updatePayload.cost === null) &&
      (updatePayload.availableQuantity === null)
    ) {
      throw errorUtilities.createError(
        "At least one field must be selected for update",
        400
      );
    }

    const { userId, productId } = updatePayload;

    const product = await productDatabase.getOne({_id:productId})

    if(!product){
        throw errorUtilities.createError("Product not found", 404)
    }

    const shop = await shopDatabase.getOne({ _id: product.shopId });

    if (!shop) {
      throw errorUtilities.createError("Shop not found. Please try again", 404);
    }

    if (shop.ownerId !== userId) {
      throw errorUtilities.createError("You can only update products in your shop(s)", 400);
    }

    if (shop.isBlacklisted) {
      throw errorUtilities.createError(
        "This shop has been deactivated. Please contact support on info@naijamade.com",
        400
      );
    }

    if (product.isBlacklisted) {
        throw errorUtilities.createError(
          "This product has been blocked. Please contact support on info@naijamade.com",
          400
        );
      }

    let updateDetails: Record<string, any> = {};

    if (updatePayload.productName) {
      updateDetails.productName = updatePayload.productName;
    }

    if (updatePayload.productCategory) {
      updateDetails.productCategory = updatePayload.productCategory;
    }

    if (updatePayload.cost) {
      updateDetails.cost =
        updatePayload.cost;
    }

    if (updatePayload.availableQuantity) {
        updateDetails.availableQuantity =
          updatePayload.availableQuantity;
      }

    const newProduct: any = await productDatabase.updateOne(
      {
        _id: productId,
      },
      {
        $set: updateDetails,
      }
    );

    const extractedShop = await productDatabase.extractProductDetails(newProduct);

    responseHandler.statusCode = 200;
    responseHandler.message = "Product updated successfully";
    responseHandler.data = {
      product: extractedShop,
    };
    return responseHandler;
  }
);

const getVendorSingleProduct = errorUtilities.withErrorHandling(

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
        isBlacklisted: 1
      }
    );

    if (!product) {
      throw errorUtilities.createError(
        "Product not found. Please try again or contact admin",
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

const getAllVendorProductsForAShop = errorUtilities.withErrorHandling(
  async (queryDetails: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { shopId } = queryDetails;

    const products = await productDatabase.getMany(
      { shopId: shopId },
      {
        shopName: 1,
        businessLegalName: 1,
        businessLicenseNumber: 1,
        shopCategory: 1,
        legalAddressOfBusiness: 1,
        isBlacklisted: 1,
      }
    );

    if (!products || products.length === 0) {
      throw errorUtilities.createError(
        "No Products found. Please try again or contact admin",
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

const deleteSingleVendorProduct = errorUtilities.withErrorHandling(
  async (deleteDetails: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { shopId, userId, productId } = deleteDetails;

    const shop = await shopDatabase.getOne(shopId);

    if (!shop) {
      throw errorUtilities.createError("Shop not found", 404);
    }
    if (shop.ownerId !== userId) {
      throw errorUtilities.createError(
        "You are not the owner of this shop. You cannot delete the product",
        403
      );
    }

    const product = await productDatabase.getOne({_id:productId})

    if(!product){
        throw errorUtilities.createError("Product not found", 404)
    }
    await productDatabase.deleteOne({_id:productId})

    responseHandler.statusCode = 200;
    responseHandler.message = "Product deleted successfully";
    return responseHandler;
  }
);

const deleteManyVendorProductsForAShop = errorUtilities.withErrorHandling(
  async (deleteDetails: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { userId, shopId, productIds } = deleteDetails;

    if (!productIds || productIds.length === 0) {
      throw errorUtilities.createError(
        "No Products selected for deletion. Please select Products.",
        404
      );
    }

    const shop = await shopDatabase.getOne(
      { _id: shopId, ownerId: userId },
      { _id: 1 }
    );

    if (!shop) {
      throw errorUtilities.createError(
        "Shop not found.",
        404
      );
    }

    await productDatabase.deleteMany({ _id: { $in: productIds } });

    responseHandler.statusCode = 200;
    responseHandler.message = "Products deleted successfully";
    return responseHandler;
  }
);

const vendorDeactivateOrReactivateProduct = errorUtilities.withErrorHandling(
  async (details: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { userId, shopId, productId } = details;

    const product = await productDatabase.getOne({ _id: productId });

    if (!product) {
      throw errorUtilities.createError("Product not found", 404);
    }

    const shop = await shopDatabase.getOne({ _id: shopId })

    if(!shop){
        throw errorUtilities.createError("Shop not found", 404)
    }

    if (shop.ownerId !== userId) {
      throw errorUtilities.createError(
        "You are not the owner of this shop.",
        403
      );
    }

    let updatedProduct: any;

    if (product.isAvailable) {
      updatedProduct = await productDatabase.updateOne(
        { _id: productId },
        { $set: { isAvailable: false } }
      );
    } else {
      updatedProduct = await productDatabase.updateOne(
        { _id: productId },
        { $set: { isAvailable: true } }
      );
    }

    const extractedProduct = await productDatabase.extractProductDetails(updatedProduct);

    responseHandler.statusCode = 200;
    responseHandler.message = `${
      extractedProduct.isAvailable
        ? "Product activated successfully"
        : "Product deactivated successfully"
    }`;
    responseHandler.data = {
      product: extractedProduct,
    };
    return responseHandler;
  }
);

const updateProductImage = errorUtilities.withErrorHandling(
  async (request: Request): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const newImage = request?.file?.path;

    if (!newImage) {
        throw errorUtilities.createError("Select an image please", 400);
      }

    const { productId } = request.body;

    const productCheck = await productDatabase.getOne({ _id: productId }, { _id: 1 })

    if(!productCheck){
        throw errorUtilities.createError(
            "Product not found",
            404
        )
    }

    const newProduct: any = await productDatabase.updateOne(
      {
        _id: productId,
      },
      {
        $set: { productImage: newImage },
      }
    );

    const extractedShop = await productDatabase.extractProductDetails(newProduct);

    responseHandler.statusCode = 200;
    responseHandler.message = "Shop image changed successfully";
    responseHandler.data = {
      product: extractedShop,
    };
    return responseHandler;
  }
);

export default {
  vendorCreateProductService,
  updateProductService,
  getVendorSingleProduct,
  getAllVendorProductsForAShop,
  deleteSingleVendorProduct,
  deleteManyVendorProductsForAShop,
  vendorDeactivateOrReactivateProduct,
  updateProductImage,
};
