import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const friendsController = {
  addFriend: asyncHandler(async (req, res) => {
    const { userId, friends } = req.body;

    if (!userId || !friends) {
      return res.status(400).json({
        success: false,
        message: "User ID and Friend ID are required",
      });
    }

    const user = await User.findById(userId).populate({
      path:'friends',
      select: 'fullName'
    });

    // Check if already added
    const isAlreadyFriend = user.friends.includes(friends);

    if (isAlreadyFriend) {
      return res.status(400).json({
        success: false,
        message: "Friend already added",
      });
    }

    user.friends.push(friends);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend added!",
      user,
    });
  }),
};

export default friendsController;
