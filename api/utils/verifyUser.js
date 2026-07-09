import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "You must be signed in"));
  }

  if (!process.env.JWT_SECRET) {
    return next(errorHandler(500, "JWT secret is not configured"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return next(errorHandler(401, "Invalid or expired token"));
    }

    req.user = user;
    next();
  });
};