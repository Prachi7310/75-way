import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      required: true,
    },

    sourceUrl: {
      type: String,
      required: true,
    },

    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WebsiteContent", websiteContentSchema);