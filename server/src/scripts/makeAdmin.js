import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "rishabh@gmail.com";

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.log("❌ User not found:", email);
      process.exit(1);
    }

    user.role = "admin";

    await user.save();

    console.log("✅ User is now ADMIN");
    console.log({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Make Admin Error:", error);
    process.exit(1);
  }
};

makeAdmin();