// backend/controllers/profileController.js
import User from "../models/User.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE PROFILE (basic fields)
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// UPDATE AVAILABILITY manually
export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { availability },
      { new: true }
    ).select("-password");

    res.json({
      message: "Availability updated",
      availability: user.availability,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update availability" });
  }
};

// UPLOAD PROFILE IMAGE
export const uploadProfileImage = async (req, res) => {
  try {
    const imagePath = "/uploads/" + req.file.filename;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imagePath },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile picture updated",
      image: user.profileImage,
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

// UPDATE LAST DONATION DATE + auto update availability
export const updateLastDonation = async (req, res) => {
  try {
    const { lastDonation } = req.body;

    if (!lastDonation) {
      return res.status(400).json({ message: "Date required" });
    }

    const donationDate = new Date(lastDonation);
    const now = new Date();

    // months difference
    const monthsDifference =
      (now.getFullYear() - donationDate.getFullYear()) * 12 +
      now.getMonth() - donationDate.getMonth();

    // compute nextAvailableAt = donationDate + 3 months
    const nextAvailable = new Date(donationDate);
    nextAvailable.setMonth(nextAvailable.getMonth() + 3);

    // availability true only if donation was >=3 months ago
    const availability = monthsDifference >= 3;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        lastDonation: donationDate,
        nextAvailableAt: nextAvailable,
        availability: availability
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Last donation updated",
      available: availability,
      nextAvailableAt: user.nextAvailableAt,
      freezeStatus: availability ? "Eligible to donate" : "Frozen for 3 months",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to update donation date" });
  }
};
