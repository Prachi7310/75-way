import api from "./api";

// =====================================
// Get All Knowledge
// =====================================

export const getKnowledge = async () => {
  const { data } = await api.get("/knowledge");
  return data;
};

// =====================================
// Get Single Knowledge
// =====================================

export const getKnowledgeById = async (id) => {
  const { data } = await api.get(
    `/knowledge/${id}`
  );

  return data;
};

// =====================================
// Search Knowledge
// =====================================

export const searchKnowledge = async (query) => {
  const { data } = await api.get(
    "/knowledge/search",
    {
      params: {
        q: query,
      },
    }
  );

  return data;
};

// =====================================
// Create Knowledge
// =====================================

export const createKnowledge = async (knowledge) => {
  const { data } = await api.post(
    "/knowledge",
    knowledge
  );

  return data;
};

// =====================================
// Update Knowledge
// =====================================

export const updateKnowledge = async (
  id,
  knowledge
) => {
  const { data } = await api.put(
    `/knowledge/${id}`,
    knowledge
  );

  return data;
};

// =====================================
// Delete Knowledge
// =====================================

export const deleteKnowledge = async (id) => {
  const { data } = await api.delete(
    `/knowledge/${id}`
  );

  return data;
};