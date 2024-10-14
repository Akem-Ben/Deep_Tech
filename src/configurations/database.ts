import mongoose from "mongoose";

let connection: typeof mongoose;

export const connectDB = async () => {
  if (connection) {
    return connection;
  } else {
    connection = await mongoose.connect("mongodb+srv://andaobong:8RhWB1aDgVSAtdr2@cluster0.twfwc1c.mongodb.net/very_deep_tech");
    console.log("Database connected");
    return connection;
  }
};