import axios from "axios";
import { API_KEY, PIXAL_BASE_URL } from "../config";

export async function getOneUnsplashImage(searchQuery) {
  if (!searchQuery) return null;

  try {

    const resp = await axios.get(
      PIXAL_BASE_URL,
      {
        params: {
          key: API_KEY,
          q: searchQuery,
          image_type: "photo",
          safesearch: true,
        },
      }
    );

    const image = resp.data?.hits?.[0];
    return image?.webformatURL || null;

  } catch (error) {
    console.error("Pixabay image fetch failed:", error);
    return null;
  }
}
