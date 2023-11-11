import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const apiKey = '40581736-d4df81fdfae18c25a1eb903af';
const baseUrl = 'https://pixabay.com/api/';
let pageNum = 1;

const lightbox = new SimpleLightbox('.gallery_link', {
  captionDelay: 200,
});

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  galleryList: document.querySelector('.gallery-list'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.hidden = true;

refs.searchForm.addEventListener('submit', onSearch);

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
});
function onSearch(e) {
  pageNum = 1;
  e.preventDefault();
  refs.galleryList.innerHTML = '';
  getDataFromApi(refs.searchForm.elements.searchQuery.value, pageNum);
}
async function getDataFromApi(query, pageNumber) {
  try {
    const response = await axios.get(
      `${baseUrl}/?key=${apiKey}&q=${query}&page=${pageNumber}&${searchParams}`
    );
    const responseDataArr = response.data.hits;

    if (responseDataArr.length === 0) {
      Notify.failure(`No images were found for the query "${query}"`, {
        position: 'right-top',
        clickToClose: true,
        timeout: 3000,
      });
    } else {
      Notify.success(`"Hooray! We found ${response.data.totalHits} images."`, {
        position: 'right-top',
        clickToClose: true,
        timeout: 3000,
      });
    }

    if (response.data.totalHits > 40) {
      refs.loadMoreBtn.style.display = 'block';
      refs.loadMoreBtn.addEventListener('click', onLoadMore);
    } else {
      refs.loadMoreBtn.hidden = true;
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`,
        {
          position: 'right-top',
          clickToClose: true,
          timeout: 3000,
        }
      );
    }
    createGaleryMarkup(responseDataArr);
    lightbox.refresh();
  } catch {
    error => {
      Notify.failure(`❌Oops! Something went wrong! ${error.message}`, {
        position: 'right-top',
        clickToClose: true,
        timeout: 3000,
      });
    };
  }
}
function onLoadMore() {
  pageNum++;
  getDataFromApi(refs.searchForm.elements.searchQuery.value, pageNum);
}

function createGaleryMarkup(photoArr) {
  const markup = photoArr
    .map(photo => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = photo;
      return `<li class="list-item" >
    <div class="photo-card">
      <a href="${largeImageURL}" class="gallery_link">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
	    <div class="info">
		    <div class="info-item">
			    <b>Likes</b>
          <p class="num">${likes}</p>
		    </div>
		    <div class="info-item">
			    <b>Views</b>
          <p class="num">${views}</p>
		    </div>
		    <div class="info-item">
			    <b>Comments</b>
          <p class="num">${comments}</p>
		    </div>
		    <div class="info-item">
			    <b>Downloads</b>
          <p class="num">${downloads}</p>
		    </div>
	</div>
</div>
</li>`;
    })
    .join('');
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}
