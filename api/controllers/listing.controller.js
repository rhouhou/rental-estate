import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getAllowedListingFields = (body) => {
  return {
    name: body.name,
    description: body.description,
    address: body.address,
    regularPrice: body.regularPrice,
    discountPrice: body.discountPrice,
    bathrooms: body.bathrooms,
    bedrooms: body.bedrooms,
    furnished: body.furnished,
    parking: body.parking,
    type: body.type,
    offer: body.offer,
    imageUrls: body.imageUrls,
  };
};

export const createListing = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return next(errorHandler(401, "You must be signed in"));
    }

    const listing = await Listing.create({
      ...getAllowedListingFields(req.body),
      userRef: req.user.id,
    });

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return next(errorHandler(400, "Invalid listing ID format"));
  }

  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, "You can only delete your own listings"));
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return next(errorHandler(400, "Invalid listing ID format"));
  }

  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, "You can only update your own listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: getAllowedListingFields(req.body),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-__v");

    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return next(errorHandler(400, "Invalid listing ID format"));
  }

  try {
    const listing = await Listing.findById(req.params.id).select("-__v").lean();

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 9, 20);
    const startIndex = parseInt(req.query.startIndex, 10) || 0;

    const query = {};

    if (req.query.searchTerm) {
      query.name = {
        $regex: escapeRegex(req.query.searchTerm),
        $options: "i",
      };
    }

    if (req.query.type && req.query.type !== "all") {
      query.type = req.query.type;
    }

    if (req.query.offer === "true") {
      query.offer = true;
    }

    if (req.query.parking === "true") {
      query.parking = true;
    }

    if (req.query.furnished === "true") {
      query.furnished = true;
    }

    const allowedSortFields = ["createdAt", "regularPrice", "discountPrice"];
    const sortField = allowedSortFields.includes(req.query.sort)
      ? req.query.sort
      : "createdAt";

    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const listings = await Listing.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(startIndex)
      .select("-__v")
      .lean();

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};