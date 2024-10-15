import Cart from '../../models/carts/cartModel';


const cartDatabase = {

create: async (data: any) => {
    try {
      const newCart = new Cart(data);
      return await newCart.save();
    } catch (error:any) {
      throw new Error(`Error creating Cart: ${error.message}`);
    }
  },

  updateOne: async (filter: any, update: any) => {
    try {
      return await Cart.findOneAndUpdate(filter, update, { new: true });
    } catch (error:any) {
      throw new Error(`Error updating Cart: ${error.message}`);
    }
  },

  getOne: async (filter: any, projection: any = {}) => {
    try {
      return await Cart.findOne(filter, projection);
    } catch (error:any) {
      throw new Error(`Error fetching Cart: ${error.message}`);
    }
  },

  deleteItemFromCart: async (userId: string, productId: string) => {
    try {
      return await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Error deleting item from Cart: ${error.message}`);
    }
  },

  deleteUserCart: async (userId: string) => {
    try {
      return await Cart.findOneAndDelete({ userId });
    } catch (error: any) {
      throw new Error(`Error deleting Cart: ${error.message}`);
    }
  },
  
}

export default cartDatabase