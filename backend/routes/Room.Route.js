import express from "express";
import {
  createRoom,
  getOwnerRoom,
  getRoom,
  toggleRoomAvailability,
} from "../controllers/room.controller.js";
import upload from "../middlewares/upload.Middleware.js";
import { protect } from "../middlewares/auth.Middleware.js";

const roomRoute = express.Router();

roomRoute.post("/", protect, upload.array("images", 4), createRoom); // FIX: protect before upload
roomRoute.get("/", getRoom); // FIX: getRoom is public, no protect needed
roomRoute.get("/owner", protect, getOwnerRoom);
roomRoute.post("/toggle-room-availability", protect, toggleRoomAvailability);

export default roomRoute;
