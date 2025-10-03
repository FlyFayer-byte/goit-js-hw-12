// src/js/render-functions.js
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('#gallery');
const loaderEl = document.querySelector('#loader');
const loadMoreBtn = document.querySelector('#load-more');

// Один екземпляр SimpleLightbox для всього додатку
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

/**
 * Додає масив карток в галерею однією операцією та refresh() lightbox.
 * @param {Array} images
 */
export function createGallery(images = []) {
  if (!Array.isArray(images) || images.length === 0) return;

  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
<li class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}">
    <img class="gallery-image" src="${webformatURL}" alt="${escapeHtml(
          tags
        )}" loading="lazy" />
  </a>
  <ul class="meta">
    <li><span>Likes</span><b>${likes}</b></li>
    <li><span>Views</span><b>${views}</b></li>
    <li><span>Comments</span><b>${comments}</b></li>
    <li><span>Downloads</span><b>${downloads}</b></li>
  </ul>
</li>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

/** Очищає галерею */
export function clearGallery() {
  galleryEl.innerHTML = '';
}

/** Показати лоадер (додає клас або знімає hidden) */
export function showLoader() {
  if (!loaderEl) return;
  loaderEl.classList.add('is-visible');
  loaderEl.hidden = false;
}

/** Сховати лоадер */
export function hideLoader() {
  if (!loaderEl) return;
  loaderEl.classList.remove('is-visible');
  loaderEl.hidden = true;
}

/** Показати кнопку Load more */
export function showLoadMoreButton() {
  if (!loadMoreBtn) return;
  loadMoreBtn.hidden = false;
}

/** Сховати кнопку Load more */
export function hideLoadMoreButton() {
  if (!loadMoreBtn) return;
  loadMoreBtn.hidden = true;
}

/** Повертає висоту першої картки (для scroll) */
export function getFirstCardHeight() {
  const first = galleryEl.querySelector('.gallery-item');
  if (!first) return 0;
  const { height } = first.getBoundingClientRect();
  return height;
}

/* базове екранування рядка для alt */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
