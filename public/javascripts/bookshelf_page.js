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
    const res = await fetch(`/api/bookshelves/${id}`);
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
      //   //- if parseInt(mode) >= 4 // This number may change based on review completion
      //   //-   td=story.avg_rating
      //   //-   th=story.rating
      // Keep these notes around for when ratings are included

      //   - var date = story.Placements[0].createdAt.toString().slice(4, 16)
      //   td.story-date-added #{date.slice(0,6) + ',' + date.slice(6)}
      const shelfListDetail = document.createElement('td');
      shelfListDetail.className = 'story-shelf-list';
      shelfListDetail.innerText = story.Bookshelves.map(shelf => shelf.name).join(', ');
      row.appendChild(shelfListDetail)

      // Consider taking this out tbh
      const dateReadDetail = document.createElement('td');
      dateReadDetail.className = 'story-date-read';
      dateReadDetail.innerText = 'Not set';
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