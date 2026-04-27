import mongoose from "mongoose";

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {  // FIX: renamed from "adress" (typo) to "address" for consistency
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
      ref: "User",
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
