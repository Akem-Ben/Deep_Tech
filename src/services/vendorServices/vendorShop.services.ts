import { mailUtilities, errorUtilities } from "../../utilities";
import { cartDatabase, productDatabase } from "../../helpers";
import { ResponseDetails } from "../../types/utilities.types";

const createVendorShopService = errorUtilities.withErrorHandling(
  async (createShopPayload: Record<string, any>): Promise<any> => {

    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { shopName, businessLegalName, businessLicenseNumber, shopCategory, legalAddressOfBusiness } = createShopPayload

    const filter = {shopName}

    let product = await productDatabase.getOne(filter, {shopName: 1})
  }
);
