import asyncHandler from "express-async-handler";
import BlogCategory from "../models/blogCatModel.js";
import validateObjectId from "../middlewares/validateObectId.js";

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const category = await BlogCategory.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const category = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const category = await BlogCategory.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogCategory = asyncHandler(async (req, res) => {
  try {
    const category = await BlogCategory.find({});
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getABlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);
  try {
    const category = await BlogCategory.findById(id);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

export {
  createBlogCategory,
  updateBlogCategory,
  getAllBlogCategory,
  getABlogCategory,
  deleteBlogCategory,
};
