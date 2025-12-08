import express from "express";

const router = express.Router();

// TEMP
router.get("/", (req, res) => {
  res.send("Donor routes working");
});

export default router;
