import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import validateObjectId from "../middlewares/validateObectId.js";

const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.find({});
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getABrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const brand = await Brand.findById(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

export { createBrand, updateBrand, getAllBrand, getABrand, deleteBrand };
