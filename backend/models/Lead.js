
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    service: {
      type: String,
      required: true
    },
    budget: {
      type: String,
      default: "Not specified"
    },
    timeline: {
      type: String,
      default: "Not specified"
    },
    message: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted", "Rejected"],
      default: "New"
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
