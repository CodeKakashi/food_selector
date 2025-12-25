import axios from "axios";

export async function getOneUnsplashImage(searchQuery) {
  if (!searchQuery) return null;

  try {
    const API_KEY = "53902089-e2509bdc126a962ae684544ce"; // keep your key

    const resp = await axios.get(
      "https://pixabay.com/api/",
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
