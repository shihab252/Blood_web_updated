import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { searchDonors } from "../controllers/donorController.js";

const router = express.Router();

// Search route (Protected)
router.get("/search", authMiddleware, searchDonors);

export default router;