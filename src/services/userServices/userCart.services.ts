import { mailUtilities, errorUtilities } from "../../utilities";
import { cartDatabase, productDatabase } from "../../helpers";
import { ResponseDetails } from "../../types/utilities.types";

const addItemToCartService = errorUtilities.withErrorHandling(
  async (cartPayload: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { productId, quantity, user_id } = cartPayload;

    const filter = {_id: productId}

    let product = await productDatabase.getOne(filter, {_id: 1})

    if(!product || product.availableQuantity === 0){
      throw errorUtilities.createError("Product does not exist or product is sold out, please delete from Cart", 404)
    }

    if(!product.isAvailable || product.isBlacklisted){
      throw errorUtilities.createError("Product is currently unavailable, please delete from Cart", 400)
    }

    let cart = await cartDatabase.getOne({ userId: user_id });

    if (!cart) {
      cart = await cartDatabase.create({ userId: user_id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    responseHandler.statusCode = 201;
    responseHandler.message = "Item added to cart";
    responseHandler.data = cart;
    return responseHandler;
  }
);

const updateCartItemService = errorUtilities.withErrorHandling(
  async (cartUpdatePayload: Record<string, any>): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { productId, quantity, user_id } = cartUpdatePayload;


    const filter = {_id: productId}

    let product = await productDatabase.getOne(filter, {_id: 1})

    if(!product || product.availableQuantity === 0){
      throw errorUtilities.createError("Product does not exist or product is sold out, please delete from Cart", 404)
    }

    if(!product.isAvailable || product.isBlacklisted){
      throw errorUtilities.createError("Product is currently unavailable, please delete from Cart", 400)
    }

    let cart = await cartDatabase.getOne({ userId: user_id });

    if (!cart) {
      throw errorUtilities.createError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex <= -1) {
      throw errorUtilities.createError("Item not found in Cart", 404);
    }

    cart.items[itemIndex].quantity = quantity;

    cart = await cartDatabase.updateOne(
      { userId: user_id, 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } }
    );

    responseHandler.statusCode = 200;
    responseHandler.message = "Cart updated successfully";
    responseHandler.data = cart;
    return responseHandler;
  }
);

const deleteCartItemService = errorUtilities.withErrorHandling(
  async (deleteItemPayload: Record<string, any>): Promise<any> => {
    
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

    const { productId, user_id } = deleteItemPayload;

    let cart = await cartDatabase.getOne({ userId: user_id });

    if (!cart) {
      throw errorUtilities.createError("Cart not found", 404);
    }

    const updatedCart = await cartDatabase.deleteItemFromCart(user_id, productId);

    if (!updatedCart) {
      throw errorUtilities.createError("Cart or item not found", 404);
    }

    responseHandler.statusCode = 200;
    responseHandler.message = "Item deleted from cart successfully";
    responseHandler.data = cart;
    return responseHandler;

  }

);

export default {
  addItemToCartService,
  updateCartItemService,
  deleteCartItemService,
};
