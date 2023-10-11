import express from "express";
const router = express.Router();
import {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
} from "../controller/blogCtrl.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { blogImageResize, uploadPhoto } from "../middlewares/uploadImages.js";

router.post("/", protect, isAdmin, createBlog);
router.put("/likes", protect, likeBlog);
router.put("/dislikes", protect, disLikeBlog);

router.put("/:id", protect, isAdmin, updateBlog);
router.put(
  "/:id",
  protect,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImageResize,
  uploadImages
);

router.get("/:id", getBlog);
router.get("/", getAllBlogs);

router.delete("/:id", protect, isAdmin, deleteBlog);

export default router;
