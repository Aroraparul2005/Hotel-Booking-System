import User from "../models/users.model.js";

export const getUser = async (req, res) => {
  try {
    const role = req.user.role;
    // FIX: field name corrected from recentlySeacrchedCities to recentlySearchedCities
    const recentlySearchedCities = req.user.recentlySearchedCities;
    res.json({ success: true, role, recentlySearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const storeRecentSearchedCity = async (req, res) => {
  try {
    const { recentlySearchedCity } = req.body;
    const user = req.user;

    if (user.recentlySearchedCities.length < 3) {
      user.recentlySearchedCities.push(recentlySearchedCity);
    } else {
      user.recentlySearchedCities.shift();
      user.recentlySearchedCities.push(recentlySearchedCity);
    }
    await user.save();
    res.json({ success: true, message: "City added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
