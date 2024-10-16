import { mailUtilities, errorUtilities } from "../../utilities";
import { Request } from "express";
import { productDatabase, shopDatabase, userDatabase } from "../../helpers";
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

    const { userId, shopId } = updatePayload;

    const shop = await shopDatabase.getOne({ _id: shopId });

    if (!shop) {
      throw errorUtilities.createError("Shop not found. Please try again", 404);
    }

    if (shop.ownerId !== userId) {
      throw errorUtilities.createError("You can only update your shop(s)", 401);
    }

    if (shop.isBlacklisted) {
      throw errorUtilities.createError(
        "This shop has been deactivated. Please contact support on info@naijamade.com",
        400
      );
    }

    let updateDetails: Record<string, any> = {};

    if (updatePayload.shopName) {
      updateDetails.shopName = updatePayload.shopName;
    }

    if (updatePayload.shopCategory) {
      updateDetails.shopCategory = updatePayload.shopCategory;
    }

    if (updatePayload.legalAddressOfBusiness) {
      updateDetails.legalAddressOfBusiness =
        updatePayload.legalAddressOfBusiness;
    }

    const newShop: any = await shopDatabase.updateOne(
      {
        _id: shopId,
      },
      {
        $set: updateDetails,
      }
    );

    const extractedShop = await shopDatabase.extractShopDetails(newShop);

    responseHandler.statusCode = 200;
    responseHandler.message = "Shop updated successfully";
    responseHandler.data = {
      shop: extractedShop,
    };
    return responseHandler;
  }
);

const getVendorSingleShop = errorUtilities.withErrorHandling(
  async (queryDetails: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { shopId } = queryDetails;

    const shop = await shopDatabase.getOne(
      { _id: shopId },
      {
        shopName: 1,
        businessLegalName: 1,
        businessLicenseNumber: 1,
        shopCategory: 1,
        legalAddressOfBusiness: 1,
        isBlacklisted: 1,
      }
    );

    if (!shop) {
      throw errorUtilities.createError(
        "Shop not found. Please try again or contact admin",
        404
      );
    }

    responseHandler.statusCode = 200;
    responseHandler.message = "Shop fetched successfully";
    responseHandler.data = {
      shop,
    };
    return responseHandler;
  }
);

const getAllVendorShops = errorUtilities.withErrorHandling(
  async (queryDetails: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { userId } = queryDetails;

    const shops = await shopDatabase.getMany(
      { ownerId: userId },
      {
        shopName: 1,
        businessLegalName: 1,
        businessLicenseNumber: 1,
        shopCategory: 1,
        legalAddressOfBusiness: 1,
        isBlacklisted: 1,
      }
    );

    if (!shops || shops.length === 0) {
      throw errorUtilities.createError(
        "No shops found. Please try again or contact admin",
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

const deleteSingleVendorShop = errorUtilities.withErrorHandling(
  async (deleteDetails: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { shopId, userId } = deleteDetails;

    const shop = await shopDatabase.getOne(shopId);

    if (!shop) {
      throw errorUtilities.createError("Shop not found", 404);
    }
    if (shop.ownerId !== userId) {
      throw errorUtilities.createError(
        "You are not the owner of this shop.",
        403
      );
    }
    await shopDatabase.deleteOne(shopId);
    responseHandler.statusCode = 200;
    responseHandler.message = "Shop deleted successfully";
    return responseHandler;
  }
);

const deleteManyVendorShops = errorUtilities.withErrorHandling(
  async (deleteDetails: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { userId, shopIds } = deleteDetails;

    if (!shopIds || shopIds.length === 0) {
      throw errorUtilities.createError(
        "No shops selected for deletion. Please provide shop IDs.",
        400
      );
    }

    const shops = await shopDatabase.getMany(
      { _id: { $in: shopIds }, ownerId: userId },
      { _id: 1 }
    );

    if (!shops || shops.length === 0) {
      throw errorUtilities.createError(
        "No valid shops found for the given user.",
        404
      );
    }

    if (shops.length !== shopIds.length) {
      throw errorUtilities.createError(
        "One or more shops are not owned by this user.",
        403
      );
    }

    await shopDatabase.deleteMany({ _id: { $in: shopIds } });

    responseHandler.statusCode = 200;
    responseHandler.message = "Shops deleted successfully";
    return responseHandler;
  }
);

const vendorDeactivateOrReactivateShop = errorUtilities.withErrorHandling(
  async (details: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { userId, shopId } = details;

    const shop = await shopDatabase.getOne({ _id: shopId });

    if (!shop) {
      throw errorUtilities.createError("Shop not found", 404);
    }

    if (shop.ownerId !== userId) {
      throw errorUtilities.createError(
        "You are not the owner of this shop.",
        403
      );
    }

    if (!shop.isActive) {
      throw errorUtilities.createError(
        "Shop is already deactivated, you can reactivate it",
        400
      );
    }

    let updatedShop: any;

    if (shop.isActive) {
      updatedShop = await shopDatabase.updateOne(
        { _id: shopId },
        { $set: { isActive: false } }
      );
    } else {
      updatedShop = await shopDatabase.updateOne(
        { _id: shopId },
        { $set: { isActive: true } }
      );
    }

    const extractedShop = await shopDatabase.extractShopDetails(updatedShop);

    responseHandler.statusCode = 200;
    responseHandler.message = `${
      extractedShop.isActive
        ? "Shop activated successfully"
        : "Shop deactivated successfully"
    }`;
    responseHandler.data = {
      shop: extractedShop,
    };
    return responseHandler;
  }
);

const updateShopImage = errorUtilities.withErrorHandling(
  async (request: Request): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const newImage = request?.file?.path;

    const { shopId } = request.body;

    if (!newImage) {
      throw errorUtilities.createError("Select an image please", 400);
    }

    const newShop: any = await shopDatabase.updateOne(
      {
        _id: shopId,
      },
      {
        $set: { displayImage: newImage },
      }
    );

    const extractedShop = await shopDatabase.extractShopDetails(newShop);

    responseHandler.statusCode = 200;
    responseHandler.message = "Shop image changed successfully";
    responseHandler.data = {
      shop: extractedShop,
    };
    return responseHandler;
  }
);

export default {
  vendorCreateProductService,
  updateProductService,
  getVendorSingleShop,
  getAllVendorShops,
  deleteSingleVendorShop,
  deleteManyVendorShops,
  vendorDeactivateOrReactivateShop,
  updateShopImage,
};
