import { syncWebsite } from "../services/website.service.js";

export const syncCompanyWebsite = async (req, res) => {
  try {
    const result = await syncWebsite();

    res.json(result);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};