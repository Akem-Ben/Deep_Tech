import Shop from "../../models/shops/shopModel";

const shopDatabaseHelper = {

  create: async (data: any) => {
    try {
      const newShop = new Shop(data);
      return await newShop.save();
    } catch (error:any) {
      throw new Error(`Error creating shop: ${error.message}`);
    }
  },

  updateOne: async (filter: any, update: any) => {
    try {
      return await Shop.findOneAndUpdate(filter, update, { new: true });
    } catch (error:any) {
      throw new Error(`Error updating shop: ${error.message}`);
    }
  },

  updateMany: async (filter: any, update: any) => {
    try {
      return await Shop.updateMany(filter, update);
    } catch (error:any) {
      throw new Error(`Error updating shops: ${error.message}`);
    }
  },

  // Delete a single document based on criteria
  deleteOne: async (filter: any) => {
    try {
      return await Shop.findOneAndDelete(filter);
    } catch (error:any) {
      throw new Error(`Error deleting shop: ${error.message}`);
    }
  },

  deleteMany: async (filter: any) => {
    try {
      return await Shop.deleteMany(filter);
    } catch (error:any) {
      throw new Error(`Error deleting shops: ${error.message}`);
    }
  },


  getOne: async (filter: any, projection: any = {}) => {
    try {
      return await Shop.findOne(filter, projection);
    } catch (error:any) {
      throw new Error(`Error fetching shop: ${error.message}`);
    }
  },

  getMany: async (filter: any, projection: any = {}, options: any = {}) => {
    try {
      return await Shop.find(filter, projection, options);
    } catch (error:any) {
      throw new Error(`Error fetching shops: ${error.message}`);
    }
  }
};

export default shopDatabaseHelper