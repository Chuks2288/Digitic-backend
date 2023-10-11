import express from "express";
const router = express.Router();
import {
  createBrand,
  updateBrand,
  getAllBrand,
  getABrand,
  deleteBrand,
} from "../controller/brandCtrl.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

router.post("/", protect, isAdmin, createBrand);
router.get("/", protect, isAdmin, getAllBrand);

router.put("/:id", protect, isAdmin, updateBrand);
router.get("/:id", protect, isAdmin, getABrand);
router.delete("/:id", protect, isAdmin, deleteBrand);

export default router;
