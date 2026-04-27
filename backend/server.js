import express from "express";
import "dotenv/config";
import cors from "cors";
import connectionDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebHooks.js";
import userRouter from "./routes/User.Route.js";
import hotelRouter from "./routes/Hotel.Route.js";
import roomRoute from "./routes/Room.Route.js";
import bookingRouter from "./routes/Bookin.Route.js";

connectionDB();
connectCloudinary();

const app = express();

app.use(cors());
app.use(clerkMiddleware());

// FIX: Clerk webhook route must receive raw body for svix signature verification.
// Register it BEFORE express.json() so the body is not pre-parsed.
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// All other routes use JSON body parsing
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/room", roomRoute);
app.use("/api/bookings", bookingRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ${port}`));
