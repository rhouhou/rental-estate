import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const getPublicUser = (user) => {
  const { password, ...rest } = user._doc;
  return rest;
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "Username, email, and password are required"));
  }

  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "Email and password are required"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = createToken(validUser._id);
    const publicUser = getPublicUser(validUser);

    return res
      .cookie("access_token", token, cookieOptions)
      .status(200)
      .json(publicUser);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;

  if (!name || !email) {
    return next(errorHandler(400, "Name and email are required"));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = createToken(existingUser._id);
      const publicUser = getPublicUser(existingUser);

      return res
        .cookie("access_token", token, cookieOptions)
        .status(200)
        .json(publicUser);
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

    const generatedUsername =
      name.split(" ").join("").toLowerCase().replace(/[^a-z0-9]/g, "") +
      Date.now().toString().slice(-6);

    const newUser = await User.create({
      username: generatedUsername,
      email,
      password: hashedPassword,
      avatar: photo,
    });

    const token = createToken(newUser._id);
    const publicUser = getPublicUser(newUser);

    return res
      .cookie("access_token", token, cookieOptions)
      .status(200)
      .json(publicUser);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    return res
      .clearCookie("access_token", cookieOptions)
      .status(200)
      .json("User has been logged out");
  } catch (error) {
    next(error);
  }
};