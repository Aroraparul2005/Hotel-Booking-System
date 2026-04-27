import express from "express";
import { protect } from "../middlewares/auth.Middleware.js";
import { registerHotel, getHotelData } from "../controllers/hotel.controller.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel);
hotelRouter.get("/", protect, getHotelData);

export default hotelRouter;
