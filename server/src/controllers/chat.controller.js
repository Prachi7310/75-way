import Chat from "../models/Chat.js";

// =======================================
// Create New Chat
// =======================================

export const createChat = async (req, res) => {
  try {

    // req.body undefined bhi ho sakti hai
    const title = req.body?.title || "New Chat";

    const chat = await Chat.create({
      title,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Chat Created Successfully",
      chat,
    });

  } catch (error) {

    console.error("Create Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================================
// Get All Chats
// =======================================

export const getAllChats = async (req, res) => {
  try {

    const chats = await Chat.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================================
// Get Single Chat
// =======================================

export const getSingleChat = async (req, res) => {
  try {

    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================================
// Delete Chat
// =======================================

export const deleteChat = async (req, res) => {
  try {

    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat Deleted Successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};