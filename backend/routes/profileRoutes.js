import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { 
  getProfile, 
  updateProfile, 
  updateAvailability,
  updateLastDonation,
  uploadProfileImage
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/availability", authMiddleware, updateAvailability);
router.put("/last-donation", authMiddleware, updateLastDonation);

router.post(
  "/upload-image",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;
