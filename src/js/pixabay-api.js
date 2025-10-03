// src/js/pixabay-api.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_PIXABAY_KEY;
const BASE_URL = 'https://pixabay.com/api/';
export const PER_PAGE = 15;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  },
});

/**
 * Повертає data з відповіді Pixabay для query та page.
 * @param {string} query
 * @param {number} page
 * @returns {Promise<Object>} data
 */
export async function getImagesByQuery(query, page = 1) {
  const q = (query ?? '').trim();
  const { data } = await api.get('', { params: { q, page } });
  return data;
}
