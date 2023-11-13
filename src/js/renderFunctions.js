import { refs } from './refs';

export function renderGaleryMarkup(photoArr) {
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
