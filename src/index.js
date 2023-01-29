import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchPixabayApi } from './fetch';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const submitBtn = document.querySelector('.btn');
const loadMoreBtn = document.querySelector('.load-more');

let lightBox = new SimpleLightbox('.gallery div a');

let page = 1;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSubmit(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.elements.searchQuery.value
    .trim()
    .replaceAll(/\s+/g, '+');

  page = 1;
  gallery.innerHTML = '';

  loadImg();
  loaderMarkup();

  if (searchQuery === '') {
    loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.info('Please, enter something to search!');
    return;
  }

  fetchPixabayApi(searchQuery)
    .then(data => {
      if (data.hits.length === 0) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success('Hooray! We found ${data.totalHits} images.');

        createCardMarkup(data.hits);

        foundImg();
        lightBox.refresh();
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtn() {
  page += 1;
  loaderMarkup();

  fetchPixabayApi(searchQuery, page)
    .then(data => {
      createCardMarkup(data.hits);
      foundImg();
      console.log(data);

      if (gallery.children.length === data.totalHits) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

function loadImg() {
  loadMoreBtn.classList.remove('is-hidden');
  loadMoreBtn.disabled = true;
}

function foundImg() {
  loadMoreBtn.textContent = 'Load more';
  loadMoreBtn.disabled = false;
}

function createCardMarkup(arr) {
  const markup = arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">

<a class="gallery__item" href='${largeImageURL}'>
  <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" "/>
</a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes <span class="desk"> ${likes} </span> </b>
    </p>
    <p class="info-item">
      <b>Views <span class="desk">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span class="desk">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span class="desk">${downloads}</span></b>
    </p>
  </div>
</div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function loaderMarkup() {
  loadMoreBtn.disabled = true;
  return (loadMoreBtn.innerHTML = '<div class="loader"></div>');
}

// async function fetchPixabayApi(query, page = 1) {
//   const BASE_URL = 'https://pixabay.com/api/';
//   const KEY = '33084667-f5fdd61fd2318acf30785d2ee';

//   const searchParams = new URLSearchParams({
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//   });

//   const response = await axios.get(
//     `${BASE_URL}?key=${KEY}&page=${page}&per_page=100&q=${query}&${searchParams}`
//   );
//   console.log(response);
//   return response.data;
// }

// page * data.hits.length === data.totalHits
