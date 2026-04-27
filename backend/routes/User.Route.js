import express from "express";
import { protect } from "../middlewares/auth.Middleware.js";
import { getUser, storeRecentSearchedCity } from "../controllers/user.controller.js";

const userRouter=express.Router();

userRouter.get("/",protect,getUser);
userRouter.post("/store-recent-search",protect,storeRecentSearchedCity);

export default userRouter;