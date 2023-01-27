import axios from 'axios';
import Notiflix from 'notiflix';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  console.log(searchQuery);
  page = 1;
  gallery.innerHTML = '';

  if (searchQuery === '') {
    Notiflix.Notify.info('Please, enter something to search!');
    return;
  }

  fetchPixabayApi(searchQuery)
    .then(data => {
      createCardMarkup(data.hits);
      console.log(data);
      loadMoreBtn.hidden = false;
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtn() {
  page += 1;
  fetchPixabayApi(searchQuery, page).then(data => {
    createCardMarkup(data.hits);
    console.log(data);

    if (page * data.hits.length === data.totalHits) {
      loadMoreBtn.hidden = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

async function fetchPixabayApi(query, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '33084667-f5fdd61fd2318acf30785d2ee';

  const searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  const response = await axios.get(
    `${BASE_URL}?key=${KEY}&page=${page}&per_page=100&q=${query}&${searchParams}`
  );
  console.log(response);
  return response.data;
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width = "300px" height = "200px"/>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
