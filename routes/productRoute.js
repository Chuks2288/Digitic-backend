import express from "express";
const router = express.Router();
import {
  addToWishlist,
  createProduct,
  deleteProduct,
  getAProduct,
  getAllProduct,
  updateProduct,
  rating,
  uploadImages,
} from "../controller/productCtrl.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import {
  productImageResize,
  uploadPhoto,
} from "../middlewares/uploadImages.js";
import fs from "fs";

router.post("/", protect, isAdmin, createProduct);
router.get("/", getAllProduct);

router.put("/wishlist", protect, addToWishlist);
router.put("/rating", protect, rating);

router.put("/:id", protect, isAdmin, updateProduct);
router.get("/:id", getAProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.put(
  "/:id",
  protect,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadImages
);

export default router;
