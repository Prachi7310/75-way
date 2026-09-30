import Knowledge from "../models/Knowledge.js";

// ==========================================
// Escape Regex Characters
// ==========================================

const escapeRegex = (value = "") => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// ==========================================
// Normalize Query
// ==========================================

const normalizeQuery = (query = "") => {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ");
};

// ==========================================
// Search Knowledge
// ==========================================

export const searchKnowledge = async (query) => {
  try {
    if (
      typeof query !== "string" ||
      !query.trim()
    ) {
      return [];
    }

    const cleanQuery =
      normalizeQuery(query);

    if (!cleanQuery) {
      return [];
    }

    // ==========================================
    // Split Query Into Words
    // ==========================================

    const words = cleanQuery
      .split(/\s+/)
      .filter(
        (word) => word.length >= 2
      );

    const uniqueWords = [
      ...new Set(words),
    ];

    // ==========================================
    // Build Search Conditions
    // ==========================================

    const conditions = [];

    // Exact / full phrase search
    const escapedQuery =
      escapeRegex(cleanQuery);

    conditions.push({
      title: {
        $regex: escapedQuery,
        $options: "i",
      },
    });

    conditions.push({
      content: {
        $regex: escapedQuery,
        $options: "i",
      },
    });

    conditions.push({
      keywords: {
        $in: uniqueWords,
      },
    });

    // ==========================================
    // Individual Word Search
    // ==========================================

    for (const word of uniqueWords) {
      const escapedWord =
        escapeRegex(word);

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

      conditions.push({
        keywords: {
          $regex: escapedWord,
          $options: "i",
        },
      });
    }

    // ==========================================
    // MongoDB Search
    // ==========================================

    const results =
      await Knowledge.find({
        status: true,

        $or: conditions,
      })
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean();

    // ==========================================
    // Remove Duplicate Documents
    // ==========================================

    const uniqueResults = [];

    const seen = new Set();

    for (const item of results) {
      const id =
        item._id.toString();

      if (seen.has(id)) {
        continue;
      }

      seen.add(id);
      uniqueResults.push(item);
    }

    // ==========================================
    // Debug
    // ==========================================

    console.log(
      "=========================================="
    );

    console.log(
      `📚 Knowledge Search: "${query}"`
    );

    console.log(
      `📚 Normalized Query: "${cleanQuery}"`
    );

    console.log(
      `📚 Knowledge Results: ${uniqueResults.length}`
    );

    console.log(
      "=========================================="
    );

    return uniqueResults;

  } catch (error) {
    console.error(
      "========== KNOWLEDGE SEARCH ERROR =========="
    );

    console.error(error);

    console.error(
      "============================================"
    );

    return [];
  }
};