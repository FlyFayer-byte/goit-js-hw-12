import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('#gallery');
const loaderEl = document.querySelector('#loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

/**
 * Додає в галерею картки зображень і оновлює SimpleLightbox.
 * @param {Array<Object>} images
 */
export function createGallery(images = []) {
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
      }) => `
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
</li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader() {
  loaderEl.classList.add('is-visible');
}

export function hideLoader() {
  loaderEl.classList.remove('is-visible');
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
