import mongoose from "mongoose";

enum Categories {
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

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Shop name is required"],
    unique: [true, "Shop name already in use"]
  },

  businessLegalName: {
    type: String,
    required: [true, "legal name of business is required"],
  },

  businessLicenseNumber: {
    type: String,
    required: [true, "registration/license Number of business is required"],
  },

  shopCategory: {
    type: String,
    enum: Object.values(Categories),
    required: [true, "shop category is required"],
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "ownerId is required"],
  },

  legalAddressOfBusiness: {
    type: String,
    required: [true, "legal address of business is required"],
  },

  displayImage: {
    type: String,
    required: [true, "A shop display image is required"]
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isBlacklisted: {
    type: Boolean,
    default: false,
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

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
