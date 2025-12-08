// backend/controllers/requestController.js
import Request from "../models/Request.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* ----------------------------------------------------
   FIND MATCHING DONORS
---------------------------------------------------- */
const findMatchingDonors = async ({ bloodGroup, area, city, district, requesterId, limit = 50 }) => {
  const baseQuery = {
    bloodGroup,
    availability: true,
    isSuspended: false,
    _id: { $ne: requesterId },
  };

  // Area first
  let donors = await User.find({ ...baseQuery, area }).limit(limit).select("-password");
  if (donors.length >= limit) return donors;

  // City
  const taken1 = donors.map(d => d._id);
  let more = await User.find({ ...baseQuery, city, _id: { $nin: taken1 } })
    .limit(limit - donors.length)
    .select("-password");

  donors = donors.concat(more);
  if (donors.length >= limit) return donors;

  // District
  const taken2 = donors.map(d => d._id);
  more = await User.find({ ...baseQuery, district, _id: { $nin: taken2 } })
    .limit(limit - donors.length)
    .select("-password");

  donors = donors.concat(more);

  return donors;
};

/* ----------------------------------------------------
   CREATE REQUEST
---------------------------------------------------- */
export const createRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, district, city, area, hospital, unitsNeeded } = req.body;

    if (!patientName || !bloodGroup || !unitsNeeded) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const newRequest = await Request.create({
      requester: req.user.id,
      patientName,
      bloodGroup,
      district,
      city,
      area,
      hospital,
      unitsNeeded,
    });

    const donors = await findMatchingDonors({
      bloodGroup,
      area,
      city,
      district,
      requesterId: req.user.id,
      limit: 100,
    });

    res.json({ msg: "Request created", request: newRequest });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   GET ACTIVE REQUESTS (Pending + Accepted)
---------------------------------------------------- */
export const getActiveRequests = async (req, res) => {
  try {
    const { bloodGroup, district, city, area } = req.query;

    const now = new Date();

    const query = {
      status: { $in: ["Pending", "Accepted"] },
      expiresAt: { $gt: now },
    };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;
    if (city) query.city = city;
    if (area) query.area = area;

    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .populate("requester", "name phone district city area");

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   GET REQUEST DETAILS
---------------------------------------------------- */
export const getRequestDetails = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("requester", "name phone")
      .populate("donorsAssigned.donor", "name phone bloodGroup profileImage");

    if (!request) return res.status(404).json({ msg: "Request not found" });

    res.json({ request });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   GET MY REQUESTS (For Dashboard + MyRequests page)
---------------------------------------------------- */
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.id })
      .sort({ createdAt: -1 })
      .populate("donorsAssigned.donor", "name phone bloodGroup profileImage");

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   ACCEPT REQUEST
---------------------------------------------------- */
export const acceptRequest = async (req, res) => {
  try {
    const donorId = req.user.id;
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    const user = await User.findById(donorId);

    if (!user.availability) return res.status(403).json({ msg: "Unavailable to donate" });

    if (request.requester.toString() === donorId) {
      return res.status(400).json({ msg: "You cannot accept your own request" });
    }

    const alreadyAccepted = request.donorsAssigned.some(d => d.donor.toString() === donorId);
    if (alreadyAccepted) return res.json({ msg: "Already accepted", request });

    request.donorsAssigned.push({ donor: donorId, status: "Accepted" });

    if (request.status === "Pending") request.status = "Accepted";

    await request.save();

    res.json({ msg: "Accepted", request });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   REJECT REQUEST
---------------------------------------------------- */
export const rejectRequest = async (req, res) => {
  try {
    const donorId = req.user.id;
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ msg: "Not found" });

    if (!request.rejectedDonors.includes(donorId)) {
      request.rejectedDonors.push(donorId);
      await request.save();
    }

    res.json({ msg: "Rejected", request });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   COMPLETE DONATION
---------------------------------------------------- */
export const completeRequest = async (req, res) => {
  try {
    const donorId = req.user.id;
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    const entry = request.donorsAssigned.find(d => d.donor.toString() === donorId);

    if (!entry) return res.status(403).json({ msg: "You must accept first" });

    entry.status = "Completed";
    entry.completedAt = new Date();

    const completedCount = request.donorsAssigned.filter(d => d.status === "Completed").length;

    if (completedCount >= request.unitsNeeded) {
      request.status = "Completed";
    }

    await request.save();

    const user = await User.findById(donorId);
    user.lastDonation = new Date();
    user.availability = false;
    await user.save();

    res.json({ msg: "Donation completed", request });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   USER STATS (Dashboard)
---------------------------------------------------- */
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // COUNT ACTIVE REQUESTS
    const activeRequests = await Request.countDocuments({
      requester: userId,
      status: { $in: ["Pending", "Accepted"] },
    });

    // COUNT DONATIONS MADE
    const donationsMade = await Request.countDocuments({
      donorsAssigned: { $elemMatch: { donor: userId, status: "Completed" } },
    });

    res.json({ activeRequests, donationsMade });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ----------------------------------------------------
   DONATION COUNT ONLY
---------------------------------------------------- */
export const getMyDonationCount = async (req, res) => {
  try {
    const count = await Request.countDocuments({
      donorsAssigned: { $elemMatch: { donor: req.user.id, status: "Completed" } },
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
