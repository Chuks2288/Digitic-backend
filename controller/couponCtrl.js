import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";
import validateObjectId from "../middlewares/validateObectId.js";

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

const getACoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const coupon = await Coupon.findById(id);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

export { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getACoupon };
