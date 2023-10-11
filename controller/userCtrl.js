import asyncHandler from "express-async-handler";
import generateToken from "../utils/jwtToken.js";
import User from "../models/userModel.js";
import validateObjectId from "../middlewares/validateObectId.js";
import generaterefreshToken from "../utils/refreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "./emailCtrl.js";

//@desc Register user
//@route POST/api/users
//@access Public
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExist = await User.findOne({ email });

  if (!userExist) {
    const newUser = User.create(req.body);
    res.status(200).json(newUser);
  } else {
    res.status(400);
    throw new Error("User Already Exist");
  }
});

//@desc Login user
//@route POST/api/users
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists && (await userExists.matchPassword(password))) {
    const refreshToken = await generaterefreshToken(userExists?._id);
    const updateuser = await User.findByIdAndUpdate(
      userExists.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: userExists?._id,
      firstname: userExists?.firstname,
      lastname: userExists?.lastname,
      email: userExists?.email,
      mobile: userExists?.mobile,
      token: generateToken(userExists?._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

//@desc Handling refreshToken for users
//@route GET/api/refresh
//@access Private/users
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);

  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  // console.log(refreshToken);

  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    // console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
  // res.json(user);
});

//@desc logout user
//@route POST/api/users
//@access Private/user
const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken }, //check here, if error remove object bracket
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

//@desc Get all users
//@route GET/api/users
//@access Private
const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(400);
    throw new Error("Loading Failed");
  }
});

//@desc Get a single user
//@route GET/api/user
//@access Private
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);

  const user = await User.findById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error("Loading Failed");
  }
});

//@desc Delete a single user
//@route DELETE/api/user
//@access Private
const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);

  const user = await User.findByIdAndDelete(id);
  if (user) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(400);
    throw new Error("Loading Failed");
  }
});

//@desc Update a single user
//@route PUT/api/user
//@access Private
const updateAUser = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const { _id } = req.user;
  validateObjectId(_id);

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
  const user = await User.findById(id);
});

//@desc Update(block) a single user
//@route PUT/api/user
//@access Private/Admin
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateObjectId(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.status(200).json({
      message: "User blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//@desc Update(unblock) a single user
//@route PUT/api/user
//@access Private/Admin
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.status(200).json({
      message: "User unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateObjectId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, Please follow this link to reset Your Password. This Link is valid for 10 minutes. <a href="http://localhost:4000/api/users/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// Work on reset password because it's not working
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token Expired, Please try again later");
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

export {
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
};
