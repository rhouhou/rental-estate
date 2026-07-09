import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.status(200).json({
    message: "User route is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only update your own account"));
  }

  try {
    const updateData = {};

    if (req.body.username) {
      updateData.username = req.body.username;
    }

    if (req.body.email) {
      updateData.email = req.body.email;
    }

    if (req.body.avatar) {
      updateData.avatar = req.body.avatar;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters"));
      }

      updateData.password = await bcryptjs.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only delete your own account"));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, "User not found"));
    }

    await Listing.deleteMany({ userRef: req.params.id });

    return res
      .clearCookie("access_token")
      .status(200)
      .json("User account and listings have been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only view your own listings"));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};