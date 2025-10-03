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
  getFirstCardHeight,
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

// При старті: ховаємо кнопку
if (typeof hideLoadMoreButton === 'function') {
  hideLoadMoreButton();
}

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
  if (!currentQuery) return;
  if (!loadMoreBtn) return;

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

    // Плавний скрол — на дві висоти картки
    const cardHeight = getFirstCardHeight();
    if (cardHeight > 0) {
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    // Визначаємо, чи кінець колекції досягнуто
    const totalShown = currentPage * PER_PAGE;
    if (totalShown >= (data.totalHits ?? totalHits)) {
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
