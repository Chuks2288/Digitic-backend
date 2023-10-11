import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      //   throw new Error("Not Authorized token expired, Please Login again");
      throw new Error("Not authorized, token failed");
    }
  } else {
    throw new Error("Not authorized, no token");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  //   console.log(req.user);
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("Not authorized as an admin");
  } else {
    next();
  }
});
export { protect, isAdmin };
