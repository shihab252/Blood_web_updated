// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },

    district: String,
    city: String,
    area: String,

    bloodGroup: { type: String, required: true },

    profileImage: { type: String, default: "" },

    lastDonation: { type: Date, default: null },

    // optional helper to track next available date (3 months after lastDonation)
    nextAvailableAt: { type: Date, default: null },

    availability: { type: Boolean, default: true },

    role: { type: String, default: "user" },

    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
