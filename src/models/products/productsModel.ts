import mongoose from "mongoose";

enum ProductCategories {
  Electronics = "Electronics",
  Fashion = "Fashion",
  HomeAndGarden = "Home and Garden",
  SportsAndOutdoors = "Sports and Outdoors",
  BeautyAndPersonalCare = "Beauty and Personal Care",
  HealthAndHousehold = "Health and Household",
  PetSupplies = "Pet Supplies",
  ToysAndGames = "Toys and Games",
  BabyProducts = "Baby Products",
  ArtsCraftsAndSewing = "Arts, Crafts and Sewing",
  MusicAndMusicalInstruments = "Music and Musical Instruments",
  OutdoorLiving = "Outdoor Living",
  Automotive = "Automotive",
  ToolsAndHomeImprovement = "Tools and Home Improvement",
  PetCareAndAccessories = "Pet Care and Accessories",
  KitchenAndDining = "Kitchen and Dining",
  OfficeProducts = "Office Products",
  IndustrialAndScientific = "Industrial and Scientific",
  Others = "Others",
}

const productSchema = new mongoose.Schema({

  productName: {
    type: String,
    required: [true, "Product name is required"],
  },

  productCategory: {
    type: String,
    enum: Object.values(ProductCategories),
    required: [true, "Product category is required"],
  },

  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: [true, "Shop Id is required"],
  },

  cost: {
    type: Number,
    required: [true, "Cost of product is required"]
  },

  availableQuantity: {
    type: Number,
    required: [true, "Product Quantity is required"]
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

  productImage: {
    type: String,
    required: [true, "Product image required"]
  },

  isBlacklisted: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
