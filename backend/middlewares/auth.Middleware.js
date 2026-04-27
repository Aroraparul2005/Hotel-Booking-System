import User from "../models/users.model.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(userId);

    // FIX: if user not found (webhook delay / race condition), return clear error
    // instead of passing null req.user to controllers which then crash
    if (!user) {
      return res.json({
        success: false,
        message: "User not found. Your account may still be setting up — please try again in a moment.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
