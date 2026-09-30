import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "about",
        "service",
        "internship",
        "training",
        "career",
        "contact",
        "technology",
        "faq",
        "policy",
        "other",
      ],
      default: "other",
    },

    content: {
      type: String,
      required: true,
    },

    keywords: [
      {
        type: String,
      },
    ],

    status: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Knowledge", knowledgeSchema);