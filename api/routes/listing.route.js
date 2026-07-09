import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { validateObjectId } from "../utils/validateObjectId.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);

router.delete("/delete/:id", verifyToken, validateObjectId("id"), deleteListing);

router.post("/update/:id", verifyToken, validateObjectId("id"), updateListing);

router.get("/get/:id", validateObjectId("id"), getListing);

router.get("/get", getListings);

export default router;