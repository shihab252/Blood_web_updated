import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createRequest,
  getActiveRequests,
  getMyRequests,
  getRequestDetails,
  acceptRequest,
  rejectRequest,
  completeRequest,
  getUserStats,
  getMyDonationCount,
} from "../controllers/requestController.js";

const router = express.Router();

// --- 1. SPECIFIC ROUTES (Must come first) ---
router.post("/create", authMiddleware, createRequest);
router.get("/active", getActiveRequests); 
router.get("/my", authMiddleware, getMyRequests);
router.get("/stats", authMiddleware, getUserStats);

// --- 2. DYNAMIC ROUTES (Must come last) ---
router.get("/:id", authMiddleware, getRequestDetails);

router.post("/:id/accept", authMiddleware, acceptRequest);
router.post("/:id/reject", authMiddleware, rejectRequest);

// CHANGED: POST -> PUT (To match frontend axios.put)
router.put("/:id/complete", authMiddleware, completeRequest);
router.get("/my-donations/count", authMiddleware, getMyDonationCount);


export default router;