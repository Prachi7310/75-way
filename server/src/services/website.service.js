import axios from "axios";
import * as cheerio from "cheerio";
import WebsiteContent from "../models/WebsiteContent.js";

const BASE_URL = "https://www.bntechnology.net";

export const syncWebsite = async () => {
  try {
    const response = await axios.get(BASE_URL);

    const $ = cheerio.load(response.data);

    const title = $("title").text().trim();

    const content = $("body").text().replace(/\s+/g, " ").trim();

    await WebsiteContent.findOneAndUpdate(
      {
        page: "home",
      },
      {
        title,
        content,
        sourceUrl: BASE_URL,
        lastSynced: new Date(),
      },
      {
        upsert: true,
      }
    );

    return {
      success: true,
      message: "Website synced successfully",
    };

  } catch (error) {
    console.error(error);

    throw new Error("Website Sync Failed");
  }
};