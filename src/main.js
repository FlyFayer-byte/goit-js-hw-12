// src/main.js
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');
const galleryEl = document.querySelector('#gallery');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

iziToast.settings({
  position: 'topRight',
  timeout: 3000,
  closeOnClick: true,
});

form.addEventListener('submit', onSearch);
if (loadMoreBtn) loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  const query = e.currentTarget.elements['search-text'].value.trim();
  if (!query) {
    iziToast.warning({ message: 'Please enter a search term' });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits ?? 0;

    if (!Array.isArray(data.hits) || data.hits.length === 0) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(data.hits);

    // show load more if there are more items
    const shown = data.hits.length + (currentPage - 1) * PER_PAGE;
    if (shown < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
    }
  } catch (err) {
    iziToast.error({ message: 'Something went wrong. Please try again later.' });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  // disable button while loading
  loadMoreBtn.disabled = true;
  showLoader();

  try {
    currentPage += 1;
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!Array.isArray(data.hits) || data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
      return;
    }

    createGallery(data.hits);

    // smooth scroll: get height of one card
    const firstCard = galleryEl.querySelector('.gallery-item');
    if (firstCard) {
      const { height } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }

    // check if we reached the end
    const shown = currentPage * PER_PAGE;
    if (shown >= (data.totalHits ?? 0)) {
      hideLoadMoreButton();
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    iziToast.error({ message: 'Something went wrong. Please try again later.' });
  } finally {
    hideLoader();
    loadMoreBtn.disabled = false;
  }
}
