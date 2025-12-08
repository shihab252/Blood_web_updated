// backend/controllers/adminController.js
import User from "../models/User.js";
import Request from "../models/Request.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

export const toggleSuspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.isSuspended = !user.isSuspended;
    await user.save();
    res.json({ msg: "Updated", user });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("requester", "name email").sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
