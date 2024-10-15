import Product from "../../models/products/productsModel";

const productDatabase = {

    create: async (data: any) => {
      try {
        const newProduct = new Product(data);
        return await newProduct.save();
      } catch (error:any) {
        throw new Error(`Error creating Product: ${error.message}`);
      }
    },
  
    updateOne: async (filter: any, update: any) => {
      try {
        return await Product.findOneAndUpdate(filter, update, { new: true });
      } catch (error:any) {
        throw new Error(`Error updating Product: ${error.message}`);
      }
    },
  
    updateMany: async (filter: any, update: any) => {
      try {
        return await Product.updateMany(filter, update);
      } catch (error:any) {
        throw new Error(`Error updating Products: ${error.message}`);
      }
    },
  
    // Delete a single document based on criteria
    deleteOne: async (filter: any) => {
      try {
        return await Product.findOneAndDelete(filter);
      } catch (error:any) {
        throw new Error(`Error deleting Product: ${error.message}`);
      }
    },
  
    deleteMany: async (filter: any) => {
      try {
        return await Product.deleteMany(filter);
      } catch (error:any) {
        throw new Error(`Error deleting Products: ${error.message}`);
      }
    },
  
  
    getOne: async (filter: any, projection: any = {}) => {
      try {
        return await Product.findOne(filter, projection);
      } catch (error:any) {
        throw new Error(`Error fetching Product: ${error.message}`);
      }
    },
  
    getMany: async (filter: any, projection: any = {}, options: any = {}) => {
      try {
        return await Product.find(filter, projection, options);
      } catch (error:any) {
        throw new Error(`Error fetching Products: ${error.message}`);
      }
    }
  };


  export default productDatabase
  