import express from "express";
const router = express.Router();
import {
  createProdCategory,
  updateProdCategory,
  getAllProdCategory,
  getAProdCategory,
  deleteProdCategory,
} from "../controller/prodCatCtrl.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

router.post("/", protect, isAdmin, createProdCategory);
router.get("/", protect, isAdmin, getAllProdCategory);

router.put("/:id", protect, isAdmin, updateProdCategory);
router.get("/:id", protect, isAdmin, getAProdCategory);
router.delete("/:id", protect, isAdmin, deleteProdCategory);

export default router;
