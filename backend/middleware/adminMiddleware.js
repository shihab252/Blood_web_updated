

import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") return res.status(403).json({ msg: "Admin only" });
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export default adminMiddleware;
