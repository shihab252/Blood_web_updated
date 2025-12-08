import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true },

    district: String,
    city: String,
    area: String,
    hospital: String,

    unitsNeeded: { type: Number, required: true },

    // Structure matches your requirement
    donorsAssigned: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["Accepted", "Completed"], default: "Accepted" },
        completedAt: { type: Date, default: null }
      }
    ],

    donorsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rejectedDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Expired"],
      default: "Pending",
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);