import { mailUtilities, errorUtilities } from "../../utilities";
import { Request } from 'express';
import {
  productDatabase,
  shopDatabase,
  userDatabase,
} from "../../helpers";
import { ResponseDetails } from "../../types/utilities.types";

const createVendorShopService = errorUtilities.withErrorHandling(

  async (createShopPayload: Record<string, any>, request:Request): Promise<any> => {

    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const {
      shopName,
      businessLegalName,
      businessLicenseNumber,
      shopCategory,
      legalAddressOfBusiness,
      userId
    } = createShopPayload;

    const user = await userDatabase.userDatabaseHelper.getOne({ _id: userId });

    if (!user) {
      throw errorUtilities.createError(
        "User Account not found, please contact Admin or login again",
        404
      );
    }

    if(user.noOfShops == 4){
      throw errorUtilities.createError(
        "A vendor cannot have more than 4 shops",
        400
      );
    }
    const filter = { shopName };

    let findShop = await shopDatabase.getOne(filter, { shopName: 1 });

    if (findShop) {
      throw errorUtilities.createError(
        "Shop name unavailable, try a different name",
        400
      );
    }

    const payload = {
      shopName,
      businessLegalName,
      businessLicenseNumber,
      shopCategory,
      legalAddressOfBusiness,
      ownerId: userId,
      displayImage: request?.file?.path
    };

    const newShop = await shopDatabase.create(payload);

    await mailUtilities.sendMail(
      user.email,
      "Dear user, <br /><br /> Congratulations Your shop has been created successfully. You are now a vendor with us. You can add products and start selling as soon as possible.",
      "SHOP CREATED"
    );

    let updatedUser:any;

    if(user.role === 'User'){

     updatedUser = await userDatabase.userDatabaseHelper.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          role: "Vendor",
        },
      }
    );

  }

    let noOfShops = user.noOfShops

    noOfShops += 1

    updatedUser = await userDatabase.userDatabaseHelper.updateOne(
      {
        _id: userId
      },
      {
        $set: {
          noOfShops: noOfShops
        }
      }
    )

    const userWithoutPassword = await userDatabase.userDatabaseHelper.extractUserDetails(updatedUser)
    
    const extractedShop = await shopDatabase.extractShopDetails(newShop)

    responseHandler.statusCode = 201;
    responseHandler.message = "Shop created successfully";
    responseHandler.data = {
      shop: extractedShop,
      user: userWithoutPassword,
    };
    return responseHandler;
  }
);

const updateShopService = errorUtilities.withErrorHandling(
  async (updatePayload: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    if (
      (!updatePayload.shopName || updatePayload.shopName === "") &&
      (!updatePayload.shopCategory || updatePayload.shopCategory === "") &&
      (!updatePayload.legalAddressOfBusiness ||
        updatePayload.legalAddressOfBusiness === "")
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

    const newShop:any = await shopDatabase.updateOne(
      {
        _id: shopId,
      },
      {
        $set: updateDetails,
      }
    );

    const extractedShop = await shopDatabase.extractShopDetails(newShop)

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
        displayImage: 1,
        noOfProducts: 1,
        isActive: 1
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
        displayImage: 1,
        noOfProducts: 1,
        isActive: 1
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
    
    await productDatabase.deleteMany({shopId:shopId})

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

    const validShopIds = shops.map(shop => shop._id);

    await productDatabase.deleteMany({ shopId: { $in: validShopIds } });

    await shopDatabase.deleteMany({ _id: { $in: validShopIds } });

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
    throw errorUtilities.createError('Shop not found', 404);
  }

  if (shop.ownerId !== userId) {
    throw errorUtilities.createError('You are not the owner of this shop.', 403);
  }

  let updatedShop: any;
  let productStatus: boolean;

  if (shop.isActive) {
    updatedShop = await shopDatabase.updateOne(
      { _id: shopId },
      { $set: { isActive: false } }
    );
    productStatus = false;
  } else {
    updatedShop = await shopDatabase.updateOne(
      { _id: shopId },
      { $set: { isActive: true } }
    );
    productStatus = true;
  }

  await productDatabase.updateMany(
    { shopId: shopId },
    { $set: { isActive: productStatus } }
  );

  const extractedShop = await shopDatabase.extractShopDetails(updatedShop)

  responseHandler.statusCode = 200;
  responseHandler.message = `${extractedShop.isActive ? "Shop activated successfully" : "Shop deactivated successfully"}`;
  responseHandler.data = {
    shop: extractedShop,
  }
  return responseHandler;
});

const updateShopImage = errorUtilities.withErrorHandling(
  async (request:Request): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const displayImage = request?.file?.path

    const { shopId } = request.body

    if (!displayImage) {
      throw errorUtilities.createError("Select an image please", 400);
    }

    const newShop:any = await shopDatabase.updateOne(
      {
        _id: shopId,
      },
      {
        $set: { displayImage }
      }
    );

    const extractedShop = await shopDatabase.extractShopDetails(newShop)

    responseHandler.statusCode = 200;
    responseHandler.message = "Shop image changed successfully";
    responseHandler.data = {
      shop: extractedShop,
    };
    return responseHandler;
  }
);


export default {
  createVendorShopService,
  updateShopService,
  getVendorSingleShop,
  getAllVendorShops,
  deleteSingleVendorShop,
  deleteManyVendorShops,
  vendorDeactivateOrReactivateShop,
  updateShopImage
};
