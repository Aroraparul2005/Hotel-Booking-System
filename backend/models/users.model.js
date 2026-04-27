import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: {
      type: String,
      // FIX: unified to "hotelOwner" everywhere (was mixed "Hotel Owner" / "hotelOwner")
      enum: ["user", "hotelOwner"],
      default: "user",
    },
    recentlySearchedCities: [ // FIX: fixed typo "recentlySeacrchedCities"
      { type: String }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
