import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Knowledge from "../models/Knowledge.js";

// ========================================
// Dashboard Stats
// ========================================

export const getDashboardStats = async (req, res) => {

  try {

    const users = await User.countDocuments();

    const chats = await Chat.countDocuments();

    const messages = await Message.countDocuments();

    const knowledge = await Knowledge.countDocuments();

    res.json({

      success: true,

      stats: {

        users,

        chats,

        messages,

        knowledge,

      },

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ========================================
// Get Users
// ========================================

export const getUsers = async (req, res) => {

  try {

    const users = await User.find()

      .select("-password")

      .sort({

        createdAt: -1,

      });

    res.json({

      success: true,

      count: users.length,

      users,

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};