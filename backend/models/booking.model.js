import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",  // FIX: ref must be a string, not an unresolved variable
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",  // FIX: ref must be a string
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",  // FIX: ref must be a string
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Cancelled"],
    },
    paymentMethod: {
      type: String,
      enum: ["Pay at Hotel", "Online"],
      default: "Pay at Hotel",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
