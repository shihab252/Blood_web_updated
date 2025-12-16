import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { 
  getAllUsers, 
  toggleSuspendUser, 
  getAllRequests,
  deleteRequest // <--- Import this
} from "../controllers/adminController.js";

const router = express.Router();

// ADMIN ROUTES (Protected)
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/users/:id/toggle-suspend", authMiddleware, adminMiddleware, toggleSuspendUser);
router.get("/requests", authMiddleware, adminMiddleware, getAllRequests);

// NEW ROUTE
router.delete("/requests/:id", authMiddleware, adminMiddleware, deleteRequest);

export default router;