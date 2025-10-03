import axios from 'axios';

const API_KEY = import.meta.env.VITE_PIXABAY_KEY;
const BASE_URL = 'https://pixabay.com/api/';

/**
 * Отримати зображення за пошуковим словом.
 * @param {string} query - рядок пошуку
 * @returns {Promise<Object>} data з відповіді (hits, total, totalHits)
 */
export async function getImagesByQuery(query) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  return data;
}
