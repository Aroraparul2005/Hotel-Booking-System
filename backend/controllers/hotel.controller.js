import User from "../models/users.model.js";
import Hotel from "../models/hotel.model.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id; // protect middleware sets req.user

    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.json({ success: false, message: "You already have a registered hotel" });
    }

    await Hotel.create({ name, address, contact, city, owner });
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getHotelData = async (req, res) => {
  try {
    const owner = req.user._id; // protect middleware sets req.user
    const hotel = await Hotel.findOne({ owner });
    if (!hotel) return res.json({ success: false, message: "No hotel found" });
    res.json({ success: true, hotel });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
