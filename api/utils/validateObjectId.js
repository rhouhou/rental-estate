import mongoose from "mongoose";
import { errorHandler } from "./error.js";

export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, `Invalid ${paramName} format`));
    }

    next();
  };
};