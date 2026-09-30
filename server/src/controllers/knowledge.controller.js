import Knowledge from "../models/Knowledge.js";

// ======================================
// Create Knowledge
// ======================================

export const createKnowledge = async (req, res) => {
  try {
    const {
      title,
      category,
      content,
      keywords,
      status,
    } = req.body;

    // Validation
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Normalize keywords
    const normalizedKeywords = Array.isArray(keywords)
      ? keywords
          .map((keyword) =>
            String(keyword).trim().toLowerCase()
          )
          .filter(Boolean)
      : typeof keywords === "string"
      ? keywords
          .split(",")
          .map((keyword) =>
            keyword.trim().toLowerCase()
          )
          .filter(Boolean)
      : [];

    const knowledge = await Knowledge.create({
      title: title.trim(),
      category: category || "other",
      content: content.trim(),
      keywords: normalizedKeywords,
      status:
        typeof status === "boolean"
          ? status
          : true,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Knowledge created successfully",
      knowledge,
    });

  } catch (error) {
    console.error(
      "CREATE KNOWLEDGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Knowledge
// ======================================

export const getKnowledge = async (req, res) => {
  try {
    const knowledge = await Knowledge.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: knowledge.length,
      knowledge,
    });

  } catch (error) {
    console.error(
      "GET KNOWLEDGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Knowledge
// ======================================

export const getKnowledgeById = async (
  req,
  res
) => {
  try {
    const knowledge =
      await Knowledge.findById(
        req.params.id
      ).lean();

    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: "Knowledge not found",
      });
    }

    return res.status(200).json({
      success: true,
      knowledge,
    });

  } catch (error) {
    console.error(
      "GET KNOWLEDGE BY ID ERROR:",
      error
    );

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid knowledge ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Knowledge
// ======================================

export const updateKnowledge = async (
  req,
  res
) => {
  try {
    const {
      title,
      category,
      content,
      keywords,
      status,
    } = req.body;

    // Validation
    if (
      title !== undefined &&
      !String(title).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (
      content !== undefined &&
      !String(content).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title =
        String(title).trim();
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (content !== undefined) {
      updateData.content =
        String(content).trim();
    }

    if (typeof status === "boolean") {
      updateData.status = status;
    }

    // Normalize keywords
    if (keywords !== undefined) {
      updateData.keywords =
        Array.isArray(keywords)
          ? keywords
              .map((keyword) =>
                String(keyword)
                  .trim()
                  .toLowerCase()
              )
              .filter(Boolean)
          : typeof keywords === "string"
          ? keywords
              .split(",")
              .map((keyword) =>
                keyword
                  .trim()
                  .toLowerCase()
              )
              .filter(Boolean)
          : [];
    }

    const knowledge =
      await Knowledge.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: "Knowledge not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Knowledge updated successfully",
      knowledge,
    });

  } catch (error) {
    console.error(
      "UPDATE KNOWLEDGE ERROR:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid knowledge ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Knowledge
// ======================================

export const deleteKnowledge = async (
  req,
  res
) => {
  try {
    const knowledge =
      await Knowledge.findById(
        req.params.id
      );

    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: "Knowledge not found",
      });
    }

    await knowledge.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Knowledge deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE KNOWLEDGE ERROR:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid knowledge ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Search Knowledge
// ======================================

export const searchKnowledge = async (
  req,
  res
) => {
  try {
    const query = req.query.q;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const cleanQuery = query.trim();

    // Escape regex special characters
    const escapedQuery =
      cleanQuery.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const words = cleanQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(
        (word) => word.length >= 2
      );

    const uniqueWords = [
      ...new Set(words),
    ];

    const conditions = [
      {
        title: {
          $regex: escapedQuery,
          $options: "i",
        },
      },
      {
        content: {
          $regex: escapedQuery,
          $options: "i",
        },
      },
      {
        keywords: {
          $in: uniqueWords,
        },
      },
    ];

    // Individual word search
    for (const word of uniqueWords) {
      const escapedWord =
        word.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      conditions.push({
        title: {
          $regex: escapedWord,
          $options: "i",
        },
      });

      conditions.push({
        content: {
          $regex: escapedWord,
          $options: "i",
        },
      });
    }

    const knowledge =
      await Knowledge.find({
        status: true,
        $or: conditions,
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    return res.status(200).json({
      success: true,
      count: knowledge.length,
      knowledge,
    });

  } catch (error) {
    console.error(
      "SEARCH KNOWLEDGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};