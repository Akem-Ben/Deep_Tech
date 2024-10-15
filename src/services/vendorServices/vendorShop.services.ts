import { mailUtilities, errorUtilities } from "../../utilities";
import {
  cartDatabase,
  productDatabase,
  shopDatabase,
  userDatabase,
} from "../../helpers";
import { ResponseDetails } from "../../types/utilities.types";

const createVendorShopService = errorUtilities.withErrorHandling(
  async (createShopPayload: Record<string, any>): Promise<any> => {
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
      userId,
    } = createShopPayload;

    const user = await userDatabase.userDatabaseHelper.getOne({ _id: userId });

    if (!user) {
      throw errorUtilities.createError(
        "User Account not found, please contact Admin or login again",
        404
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
    };

    const newShop = await shopDatabase.create(payload);

    await mailUtilities.sendMail(
      user.email,
      "Dear user, <br /><br /> Congratulations Your shop has been created successfully. You are now a vendor with us. You can add products and start selling as soon as possible.",
      "SHOP CREATED"
    );

    const updatedUser = await userDatabase.userDatabaseHelper.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          role: "Vendor",
        },
      }
    );
    responseHandler.statusCode = 201;
    responseHandler.message = "Shop created successfully";
    responseHandler.data = {
        shop: newShop,
        user: updatedUser
    }
    return responseHandler;
  }
);

export default {
  createVendorShopService,
};
