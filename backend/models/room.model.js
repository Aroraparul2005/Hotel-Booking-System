import mongoose from "mongoose";
// FIX: was importing Hotel which is unneeded and caused circular issues

const roomSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",  // FIX: ref must be a string, not the Hotel variable
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: {  // FIX: was "aminities" (typo) - must match what's used in controllers
      type: Array,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
