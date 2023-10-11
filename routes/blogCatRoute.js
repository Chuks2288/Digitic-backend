import express from "express";
const router = express.Router();
import {
  createBlogCategory,
  updateBlogCategory,
  getAllBlogCategory,
  getABlogCategory,
  deleteBlogCategory,
} from "../controller/blogCatCtrl.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

router.post("/", protect, isAdmin, createBlogCategory);
router.get("/", protect, isAdmin, getAllBlogCategory);

router.put("/:id", protect, isAdmin, updateBlogCategory);
router.get("/:id", protect, isAdmin, getABlogCategory);
router.delete("/:id", protect, isAdmin, deleteBlogCategory);

export default router;
