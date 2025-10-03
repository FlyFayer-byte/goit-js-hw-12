import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const form = document.querySelector('#search-form');
const submitBtn = form.querySelector('button[type="submit"]');

iziToast.settings({
  position: 'topRight',
  timeout: 3000,
  closeOnClick: true,
});

form.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  const query = e.currentTarget.elements['search-text'].value.trim();
  if (!query) {
    iziToast.warning({ message: 'Please enter a search term' });
    return;
  }

  clearGallery();
  showLoader();
  submitBtn.disabled = true;

  try {
    const data = await getImagesByQuery(query);

    if (!data?.hits?.length) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(data.hits);
  } catch (err) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
    submitBtn.disabled = false;
  }
}
