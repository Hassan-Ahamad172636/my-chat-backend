import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const friendsController = {
  addFriend: asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find the user and update isFriend to true
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isFriend: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User marked as friend successfully",
      user: updatedUser,
    });
  }),
};

export default friendsController;
