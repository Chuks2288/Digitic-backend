import express from "express";
const router = express.Router();
import {
  createUser,
  authUser,
  getAllUser,
  getAUser,
  deleteAUser,
  updateAUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} from "../controller/userCtrl.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

router.post("/register", createUser);
router.post("/login", authUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.get("/all-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOut);

router.get("/:id", protect, isAdmin, getAUser);
router.delete("/:id", deleteAUser);

// router.put("/:id", updateAUser);
router.put("/edit-user", protect, updateAUser);
router.put("/block-user/:id", protect, isAdmin, blockUser);
router.put("/unblock-user/:id", protect, isAdmin, unBlockUser);
router.put("/password", protect, updatePassword);
router.put("/reset-password/:token", resetPassword);

export default router;
