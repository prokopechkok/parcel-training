import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { refs } from './refs';
import { renderGaleryMarkup } from './renderFunctions';
import { onLoadMore } from './handlers';

const apiKey = '40581736-d4df81fdfae18c25a1eb903af';
const baseUrl = 'https://pixabay.com/api/';

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
});

const lightbox = new SimpleLightbox('.gallery_link', {
  captionDelay: 200,
});

export async function getPicturesFromApi(query, pageNumber) {
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
    renderGaleryMarkup(responseDataArr);
    lightbox.refresh();
  } catch {
    error => {
      Notify.failure(`❌Oops! Something went wrong!`, {
        position: 'right-top',
        clickToClose: true,
        timeout: 3000,
      });
      console.log(error);
    };
  }
}
