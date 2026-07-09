import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { validateObjectId } from "../utils/validateObjectId.js";

const router = express.Router();

router.get("/test", test);

router.post("/update/:id", verifyToken, validateObjectId("id"), updateUser);

router.delete("/delete/:id", verifyToken, validateObjectId("id"), deleteUser);

router.get("/listings/:id", verifyToken, validateObjectId("id"), getUserListings);

router.get("/:id", validateObjectId("id"), getUser);

export default router;