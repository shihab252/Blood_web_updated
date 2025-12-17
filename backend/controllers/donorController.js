import User from "../models/User.js";

export const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, district, city, area } = req.query;
    const currentUserId = req.user.id; // Get the ID of the person searching

    // Build Query
    let query = { 
      role: "user", 
      isSuspended: false,
      _id: { $ne: currentUserId }
    };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;
    if (city) query.city = city;
    if (area) query.area = area;

    const donors = await User.find(query)
      .select("-password")
      .sort({ availability: -1, lastDonation: 1 });

    res.json({ donors });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};