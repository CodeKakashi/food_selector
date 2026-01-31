import { useEffect, useState } from "react";
import { getOneUnsplashImage } from "../../components/function.jsx";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300?text=Recipe";

const DishImage = ({ name, course, size = 110 }) => {
  const [imgUrl, setImgUrl] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      // 1️⃣ Try dish name
      let url = await getOneUnsplashImage(name);

      // 2️⃣ Randomized course fallback
      if (!url && course) {
        const randomQuery = getRandomFoodQuery(course);
        url = await getOneUnsplashImage(randomQuery);
      }

      if (!cancelled) {
        setImgUrl(url || FALLBACK_IMAGE);
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [name, course]);

  return (
    <img
      src={imgUrl}
      alt={name}
      loading="lazy"
      width={size}
      height={size}
      style={{
        objectFit: "cover",
        borderRadius: 8,
        flexShrink: 0,
      }}
    />
  );
};

export default DishImage;


function getRandomFoodQuery(base) {
  const variants = [
    "food",
    "dish",
    "meal",
    "cuisine",
    "recipe",
    "plated food",
  ];

  const randomWord = variants[Math.floor(Math.random() * variants.length)];
  return `${base} ${randomWord}`;
}
