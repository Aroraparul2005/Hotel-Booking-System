import mongoose from "mongoose";
import Room from "../models/room.model.js";
import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const roomId = new mongoose.Types.ObjectId(room);
    const bookings = await Booking.find({
      room: roomId,
      checkInDate: { $lte: new Date(checkOutDate) },
      checkOutDate: { $gte: new Date(checkInDate) },
    });
    return bookings.length === 0;
  } catch (error) {
    console.error("checkAvailability error:", error.message);
    return false;
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    if (!isAvailable) return res.json({ success: false, message: "Room not available for selected dates" });

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) return res.json({ success: false, message: "Room not found" });

    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (24 * 3600 * 1000));
    const totalPrice = roomData.pricePerNight * nights;

    const booking = await Booking.create({
      user, room, hotel: roomData.hotel._id,
      guests: +guests, checkInDate, checkOutDate, totalPrice,
    });
    res.json({ success: true, message: "Booking created successfully", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    // FIX: use req.user._id (set by protect middleware) consistently
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) return res.json({ success: false, message: "No hotel found" });

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
    res.json({ success: true, dashboardData: { bookings, totalBookings, totalRevenue } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
