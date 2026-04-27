import Hotel from "../models/hotel.model.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/room.model.js";

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.user._id });

    if (!hotel) return res.json({ success: false, message: "No hotel found. Please register your hotel first." });

    const uploadFiles = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });
    const images = await Promise.all(uploadFiles);

    await Room.create({
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
      hotel: hotel._id,
    });

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getRoom = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({ path: "hotel", populate: { path: "owner", select: "image userName" } })
      .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOwnerRoom = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.user._id });
    if (!hotelData) return res.json({ success: true, rooms: [] });
    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    if (!roomData) return res.json({ success: false, message: "Room not found" });
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Availability toggled successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
