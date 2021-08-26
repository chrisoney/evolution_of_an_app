import { starClickEvent, starHoverEvent, starContainerEvent } from './events/star_events.js';

const add_bookshelf_button = document.querySelector('.add-new-bookshelf-button');
const new_bookshelf_form_container = document.querySelector('.add-new-bookshelf-form-container');
const new_bookshelf_input = document.querySelector('.add-new-bookshelf-input')
const new_bookshelf_submit_button = document.querySelector('.add-new-bookshelf-submit-button')
const bookshelf_container = document.querySelector('.bookshelves-container')
add_bookshelf_button.addEventListener('click', (e) => {
  add_bookshelf_button.classList.toggle('hidden')
  new_bookshelf_form_container.classList.toggle('hidden')
})

new_bookshelf_submit_button.addEventListener('click', async (e) => {
  const mode = document.querySelector('.mode-container').id;
  const name = new_bookshelf_input.value;
  // https://stackoverflow.com/questions/32765157/filter-or-map-nodelists-in-es6
  const otherNames = Array.prototype.slice.call(document.querySelectorAll('.bookshelf-selector')).map(ele => ele.innerText);
  if (name === '' || otherNames.includes(name)) {
    alert("Shelf couldn't be created. Shelf name is either invalid or a duplicate.");
    return;
  }
  const res = await fetch('/api/bookshelves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name})
  })
  const { bookshelf } = await res.json();
  const newBookshelf = document.createElement('div');
  newBookshelf.classList.add('bookshelf-selector');
  newBookshelf.id = bookshelf.id;
  newBookshelf.innerText = bookshelf.name;
  newBookshelf.innerText = parseInt(mode) >= 3 ? bookshelf.name + " (0)" : bookshelf.name;
  bookshelf_container.appendChild(newBookshelf);
  add_bookshelf_button.classList.toggle('hidden')
  new_bookshelf_form_container.classList.toggle('hidden')
})

const bookshelf_selectors = document.querySelectorAll('.bookshelf-selector');

const selectorEvent = async (e) => {
  bookshelf_selectors.forEach(button => button.classList.remove('selected'));
  e.target.classList.add('selected');
  const mode = document.querySelector('.mode-container').id;

  if (parseInt(mode) >= 3) {
    // This is where we'll replace the stories
    const id = e.target.id;
    const userId = e.target.dataset.userId;
    const res = await fetch(`/api/bookshelves/${id}?userId=${userId}`);
    const { bookshelf } = await res.json();
    const table_body = document.querySelector('tbody');
    table_body.innerHTML = ''
    for (let i = 0; i < bookshelf.Stories.length; i++){
      const story = bookshelf.Stories[i];
      const row = document.createElement('tr');
      row.className = 'story-row';

      const imgDetail = document.createElement('td');
      const storyImg = document.createElement('img');
      storyImg.src = story.imageUrl;
      storyImg.className = 'image-preview'
      imgDetail.appendChild(storyImg);
      row.appendChild(imgDetail);

      const titleDetail = document.createElement('td');
      titleDetail.className = 'story-title';
      const titleLink = document.createElement('a');
      titleLink.href = `/stories/${story.id}`;
      titleLink.innerText = story.title;
      titleDetail.appendChild(titleLink);
      row.appendChild(titleDetail);

      const authorDetail = document.createElement('td');
      authorDetail.className = 'story-author';
      authorDetail.innerText = story.author;
      row.appendChild(authorDetail);
        // - if parseInt(mode) >= 4 // This number may change based on review completion
        // -   td=story.avg_rating
        // -   th=story.rating
      if (parseInt(mode) > 3) {
        const allRatings = story.Reviews.map(review => review.rating);
        let avgRating;
        if (allRatings.length === 0) {
          avgRating = 0;
        }
        else {
          avgRating = Math.round(allRatings.reduce((a, b) => { return a + b }, 0) / allRatings.length * 100) / 100;
        }
        const userId = parseInt(window.location.pathname.split('/')[2], 10);
        const userReview = story.Reviews.filter(review => review.userId === userId && review.rating >= 0)[0]
        const loggedIn = document.querySelector('.logged-in-user')

        // First detail
        const avgRatingDetail = document.createElement('td');
        avgRatingDetail.className = 'avg-rating';
        avgRatingDetail.innerText = avgRating;
        row.appendChild(avgRatingDetail);
        // Second detail

        const ratingsContainer = document.createElement('div')
        ratingsContainer.className = 'ratings-container';
        ratingsContainer.dataset.storyId = story.id;
        const userRatingDetail = document.createElement('td');
        userRatingDetail.className = 'user-rating-detail';
        if (userReview && userReview.rating) {
          let i = 0, j = userReview.rating + 1
          while (i < userReview.rating) {
            const starEle = document.createElement('span')
            starEle.dataset.score = i + 1;
            starEle.className = `fas fa-star ${userReview.userId === parseInt(loggedIn.id, 10) ? 'user-rating' : ''}`;
            if (userReview.userId === parseInt(loggedIn.id, 10)) {
              starEle.addEventListener('click', starClickEvent);
              starEle.addEventListener('mouseover', starHoverEvent)
            }
            i++
            ratingsContainer.appendChild(starEle)
          }
          while (j <= 5){
            const starEle = document.createElement('span')
            starEle.dataset.score = j;
            starEle.className = `far fa-star ${userReview.userId === parseInt(loggedIn.id, 10) ? 'user-rating' : ''}`;
            if (userReview.userId === parseInt(loggedIn.id, 10)) {
              starEle.addEventListener('click', starClickEvent);
              starEle.addEventListener('mouseover', starHoverEvent)
            }
            j++
            ratingsContainer.appendChild(starEle)
          }
          ratingsContainer.dataset.currentRating = userReview.rating;
        } else {
          let i = 0;
          while (i < 5) {
            const starEle = document.createElement('span')
            starEle.dataset.score = i + 1;
            starEle.className = `far fa-star ${userId === parseInt(loggedIn.id, 10) ? 'user-rating' : ''}`;
            if (userId === parseInt(loggedIn.id, 10)) {
              starEle.addEventListener('click', starClickEvent);
              starEle.addEventListener('mouseover', starHoverEvent)
            }
            i++
            ratingsContainer.appendChild(starEle)
          }
          ratingsContainer.dataset.currentRating = 0;
        }
        if (userId === parseInt(loggedIn.id, 10)) {
          ratingsContainer.addEventListener('mouseout', starContainerEvent);
        }
        userRatingDetail.appendChild(ratingsContainer);
        row.appendChild(userRatingDetail);
      }

        // - var date = story.Placements[0].createdAt.toString().slice(4, 16)
        // td.story-date-added #{date.slice(0,6) + ',' + date.slice(6)}
      const shelfListDetail = document.createElement('td');
      shelfListDetail.className = 'story-shelf-list';
      shelfListDetail.innerText = story.Bookshelves.map(shelf => shelf.name).join(', ');
      row.appendChild(shelfListDetail)

      // Consider taking this out tbh
      const dateReadDetail = document.createElement('td');
      const readShelf = story.Bookshelves.filter(shelf => shelf.name === 'Read');
      if (readShelf.length > 0) {
        dateReadDetail.className = 'story-date-added';

        dateReadDetail.innerText = new Date(readShelf[0].updatedAt).toString().slice(4, 16)
      } else {
        dateReadDetail.className = 'story-date-read';
        dateReadDetail.innerText = 'Not set';
      }
      row.appendChild(dateReadDetail);

      let date = new Date(story.Placements[0].createdAt).toString().slice(4, 16);
      const dateAddedDetail = document.createElement('td');
      dateAddedDetail.className = 'story-date-added'
      dateAddedDetail.innerText = date.slice(0, 6) + ',' + date.slice(6);
      row.appendChild(dateAddedDetail);
      table_body.appendChild(row);
    }
  }
}


bookshelf_selectors.forEach(button => button.addEventListener('click', selectorEvent));

const user_stars = document.querySelectorAll('.fa-star.user-rating');
const star_container = document.querySelectorAll('.ratings-container')

user_stars.forEach((button) => button.addEventListener('click', starClickEvent))
user_stars.forEach((button) => button.addEventListener('mouseover', starHoverEvent))

star_container.forEach(container => container.addEventListener('mouseout', starContainerEvent));