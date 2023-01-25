import axios from 'axios';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form')

searchForm.addEventListener('submit', onSearch)

function onSearch(e){
    e.preventDefault()
    const searchQuery = e.currentTarget.elements.searchQuery.value;
    console.log(searchQuery)

    fetchPixabayApi(searchQuery)
  .then(data => createCardMarkup(data.hits))
  .catch(error => console.log(error));
}

async function fetchPixabayApi() {
  // const BASE_URL = 'https://pixabay.com/api/';
  // const KEY = '33084667-f5fdd61fd2318acf30785d2ee';

  const response = await axios.get(
    'https://pixabay.com/api/?key=33084667-f5fdd61fd2318acf30785d2ee&q=cat&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40'
  );
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

  gallery.innerHTML = markup;
}
