import { getPicturesFromApi } from './js/getPicturesFromApi';
import { refs } from './js/refs';

export let pageNum = 1;

refs.loadMoreBtn.hidden = true;
refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  pageNum = 1;
  refs.galleryList.innerHTML = '';
  await getPicturesFromApi(refs.searchForm.elements.searchQuery.value, pageNum);
}
