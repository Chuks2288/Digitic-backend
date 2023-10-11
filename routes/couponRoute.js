import express from "express";
const router = express.Router();
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getACoupon,
} from "../controller/couponCtrl.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";

router.post("/", protect, isAdmin, createCoupon);
router.get("/", protect, isAdmin, getAllCoupons);
router.get("/:id", protect, isAdmin, getACoupon);
router.put("/:id", protect, isAdmin, updateCoupon);
router.delete("/:id", protect, isAdmin, deleteCoupon);

export default router;
