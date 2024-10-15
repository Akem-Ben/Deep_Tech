import User from "models/users/usersModel";

const userDatabaseHelper = {

  create: async (data: any) => {
    try {
      const newUser = new User(data);
      return await newUser.save();
    } catch (error:any) {
      throw new Error(`Error creating User: ${error.message}`);
    }
  },

  updateOne: async (filter: any, update: any) => {
    try {
      return await User.findOneAndUpdate(filter, update, { new: true });
    } catch (error:any) {
      throw new Error(`Error updating User: ${error.message}`);
    }
  },

  updateMany: async (filter: any, update: any) => {
    try {
      return await User.updateMany(filter, update);
    } catch (error:any) {
      throw new Error(`Error updating Users: ${error.message}`);
    }
  },

  deleteOne: async (filter: any) => {
    try {
      return await User.findOneAndDelete(filter);
    } catch (error:any) {
      throw new Error(`Error deleting User: ${error.message}`);
    }
  },

  deleteMany: async (filter: any) => {
    try {
      return await User.deleteMany(filter);
    } catch (error:any) {
      throw new Error(`Error deleting Users: ${error.message}`);
    }
  },


  getOne: async (filter: any, projection: any = {}) => {
    try {
      return await User.findOne(filter, projection);
    } catch (error:any) {
      throw new Error(`Error fetching User: ${error.message}`);
    }
  },

  getMany: async (filter: any, projection: any = {}, options: any = {}) => {
    try {
      return await User.find(filter, projection, options);
    } catch (error:any) {
      throw new Error(`Error fetching Users: ${error.message}`);
    }
  }
};

export default {
    userDatabaseHelper
}