import ImageAPiService from './js/fetchImages';
import LoadMoreBtn from './js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// const totalHits = img.totalHits;
// const allImages = pixabayApi.hasMorePhotos();
const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
  galleryContainer: document.querySelector('.gallery-list'),
};
const imageApiService = new ImageAPiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });
const imageLightbox = new SimpleLightbox('.gallery-list .gallery__link', {
  captionsData: 'alt',
  captionDelay: 250,
});
refs.searchForm.addEventListener('submit', handleSearchImageClickBtn);
loadMoreBtn.refs.button.addEventListener('click', handleLoadMoreImage);
async function handleSearchImageClickBtn(e) {
  e.preventDefault();
  console.log(e); //це можна усунути
  refs.searchInput.focus();
  imageApiService.query = e.target.searchQuery.value.trim();
  imageApiService.resetPage();
  if (imageApiService.query === '') {
    Notify.info('Please fill in the field to search for images');
    loadMoreBtn.hide();
    clearMarkup();
    return;
  }
  loadMoreBtn.show();
  loadMoreBtn.disable();
  clearMarkup();
  try {
    loadMoreBtn.enable();
    const response = await imageApiService.fetchImages();
    if (response.totalHits === 0) {
      //не потрібно провіряти довжину масиву, у нас є totalHits у кожному виклику цієї функції
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
      loadMoreBtn.hide();
      return;
    }
    Notify.success(`Hooray! We found ${response.totalHits} images.`);
    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      appendGalleryMarkup(response)
    );
    imageLightbox.refresh();
    smoothScroll(1.2); //тут ця функція не потрібна, ти при першому виклику функції одразу проскролюєш вниз, її треба використовувати тільки коли натискаєш кнопку ЛоадМоре
    if (response.totalHits <= 40) {
      loadMoreBtn.hide();
    }
  } catch (error) {
    Notify.warning('We are sorry. There was an error');
  }
}
async function handleLoadMoreImage() {
  try {
    imageApiService.incrementPage();
    loadMoreBtn.disable();
    const response = await imageApiService.fetchImages();
    loadMoreBtn.enable();
    Notify.success(`Hooray! We found more images.`);
    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      appendGalleryMarkup(response)
    );
    imageLightbox.refresh();
    pageNumbers(response);
    smoothScroll(2);
  } catch (error) {
    Notify.warning('We are sorry. There was an error');
  }
}
// функція перевірки кількості зображень для сторінок. Якщо у нас на новій сторінці менше 40 елементів, то ми прибираємо кнопу
function pageNumbers(response) {
  if (Math.ceil(response.totalHits / 40) !== imageApiService.page) {
    return;
  }
  console.log('aaaaaaa');
  loadMoreBtn.hide(); //постарайся наступного разу не називату зміну так само як класс тільки з маленької літери, це потім призводить до багатьох помилок
  Notify.failure("We're sorry, but you've reached the end of search results");
}
function appendGalleryMarkup({ hits }) {
  const markUp = hits.map(
    ({
      comments,
      downloads,
      largeImageURL,
      webformatURL,
      views,
      tags,
      likes,
    }) => {
      return `<li class="gallery__item">
    <a href="${largeImageURL}" class="gallery__link link">
      <div class="gallery__thumb"><img src="${webformatURL}" alt="${tags}" class="gallery__img" width="300" loading="lazy"></div>
      <div class="box-info">
    <ul class="gallery-info list">
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b>
    likes
        </b>
        ${likes}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    comments
        </b>
        ${comments}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    views
        </b>
        ${views}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    downloads
        </b>
        ${downloads}
      </p>
      </li>
    </ul>
    </div>
    </a>
    </li>
    `;
    }
  );
  return markUp.join('');
}
function clearMarkup() {
  refs.galleryContainer.innerHTML = '';
  refs.searchInput.value = '';
}
function smoothScroll(num) {
  const { height: cardHeight } = document
    .querySelector('.gallery-list')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * num,
    behavior: 'smooth',
  });
}
window.onscroll = debounce(() => {
  scrollFunction();
}, 300);
function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    document.getElementById('topBtn').style.display = 'block';
  } else {
    document.getElementById('topBtn').style.display = 'none';
  }
}
const topBtn = document.querySelector('.top-btn');
topBtn.addEventListener('click', topFunction);
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}