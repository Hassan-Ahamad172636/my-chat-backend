import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/generateApiResponse.js";
import { generateToken } from "../utils/jwt.js";
import { Conversation } from "../models/conversation.model.js";
import { Chat } from "../models/chat.model.js";
import path from "path";
import fs from "fs";

export const userController = {
  // ✅ CREATE user
  create: asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    const profilePhoto = req.file?.path || ""; // safe way

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return apiResponse(res, 400, false, "User already exists!");
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profilePhoto,
    });

    if (!user) {
      return apiResponse(
        res,
        400,
        false,
        "FullName, email and password are required!"
      );
    }

    return apiResponse(res, 200, true, "User created successfully!", { user });
  }),

  // ✅ LOGIN user
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return apiResponse(res, 400, false, "User not found!");
    }

    const correctPassword = await user.matchPassword(password);

    if (!correctPassword) {
      return apiResponse(res, 400, false, "Password is incorrect!");
    }

    const token = generateToken({ id: user._id }, "1d");

    // Optional: don't return password
    user.password = undefined;

    return apiResponse(res, 200, true, "User logged in successfully!", {
      user,
      token,
    });
  }),

  // ✅ GET ALL users
  getAll: asyncHandler(async (req, res) => {
    const users = await User.find({}).populate({
      path: 'friends',
      select: 'fullName profilePhoto'
    });

    return apiResponse(res, 200, true, "All null users fetched successfully!", {
      users,
    });
  }),

  // ✅ GET ONE user by ID
  getOne: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return apiResponse(res, 404, false, "User not found!");
    }

    return apiResponse(res, 200, true, "User fetched successfully!", {
      user,
    });
  }),

  // ✅ UPDATE user by ID
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, email, password } = req.body;
    const profilePhoto = req.file
      ? req.file.path.replace(/\\/g, "/").replace("public/", "")
      : null;

    const user = await User.findById(id);
    if (!user) {
      return apiResponse(res, 404, false, "User not found!");
    }

    // ✅ Delete previous photo if exists and new one is uploaded
    if (profilePhoto && user.profilePhoto) {
      const oldPath = path.join(process.cwd(), "public", user.profilePhoto); // corrected absolute path
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); // delete the old file
      }
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    await user.save();

    return apiResponse(res, 200, true, "User updated successfully!", {
      user,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 1. Delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return apiResponse(res, 404, false, "User not found!");
    }

    // 2. Delete all conversations where the user is a participant
    await Conversation.deleteMany({ participants: id });

    // 3. Delete all messages sent by this user
    await Chat.deleteMany({ sender: id });

    return apiResponse(
      res,
      200,
      true,
      "User and related data deleted successfully!"
    );
  }),
};
