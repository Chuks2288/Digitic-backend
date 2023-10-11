import asyncHandler from "express-async-handler";
import ProdCategory from "../models/prodCatModel.js";
import validateObjectId from "../middlewares/validateObectId.js";

const createProdCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ProdCategory.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const category = await ProdCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const category = await ProdCategory.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProdCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ProdCategory.find({});
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const category = await ProdCategory.findById(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

export {
  createProdCategory,
  updateProdCategory,
  getAllProdCategory,
  getAProdCategory,
  deleteProdCategory,
};
