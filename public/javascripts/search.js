const standardShelfEvent = async (e) => {
  const bookshelfId = e.target.id;
  const storyId = e.target.dataset.storyId;
  const res = await fetch('/api/placements', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookshelfId, storyId })
  })
  const { placement } = await res.json();
  if (res.ok) {
      const otherShelves = e.target.parentElement.querySelectorAll('.standard-shelf')
      otherShelves.forEach(ele => ele.classList.remove('bold-shelf'))
      e.target.classList.add('bold-shelf')
      const otherContainer = e.target.parentElement.parentElement.previousSibling;
      otherContainer.className = 'feed-bookshelf-selected';
      otherContainer.innerHTML = '';
      const checkmark = document.createElement('i');
      checkmark.className = 'fas fa-check feed-check';
      otherContainer.appendChild(checkmark);
      const shelfName = document.createElement('div');
      shelfName.className = 'feed-bookshelf-selected-name';
      shelfName.innerText = e.target.innerText;
      otherContainer.appendChild(shelfName)
  }
}

const customShelfEvent = async (e) => {
  e.preventDefault();

  let container, checkbox, shelfName;
  switch (e.target.className) {
      case 'nonstandard-shelf-container':
          container = e.target;
          checkbox = e.target.children[0];
          shelfName = e.target.children[1];
          break;
      case 'nonstandard-shelf-checkbox':
          container = e.target.parentElement;
          checkbox = e.target;
          shelfName = e.target.nextSibling;
          break;
      case 'standard-shelf':
          container = e.target.parentElement;
          checkbox = e.target.previousSibling;
          shelfName = e.target;
          break;
      default:
          console.log('Uh oh, what\'s this?')
  }

  const storyId = container.dataset.storyId;
  const bookshelfId = container.id;
  const res = await fetch('/api/placements', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookshelfId, storyId })
  })
  if (res.ok) checkbox.checked = !checkbox.checked;
}

const wtrEvent = async (e) => {
  const bookshelfId = e.target.id;
  const storyId = e.target.dataset.storyId;
  const res = await fetch('/api/placements', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookshelfId, storyId })
  })
  const { placement } = await res.json();
  // div(class='feed-bookshelf-selected' id=shelf_id)
  //     i.fas.fa-check.feed-check
  //     .feed-bookshelf-selected-name #{shelf_name}
  // i(class='feed-modal-button fas fa-chevron-down')
  const parent = e.target.parentElement;
  parent.innerHTML = '';
  const leftContainer = document.createElement('div');
  leftContainer.className = 'feed-bookshelf-selected';
  leftContainer.id = placement.bookshelfId;
  const checkmark = document.createElement('i');
  checkmark.className = 'fas fa-check feed-check';
  leftContainer.appendChild(checkmark);
  const shelfName = document.createElement('div');
  shelfName.className = 'feed-bookshelf-selected-name';
  shelfName.innerText = 'Want To Read';
  leftContainer.appendChild(shelfName)
  parent.appendChild(leftContainer);
  const modalContainer = document.createElement('div');
  modalContainer.className = 'feed-modal-container';
  const modalButton = document.createElement('i');
  modalButton.className = 'feed-modal-button fas fa-chevron-down';
  modalContainer.appendChild(modalButton)
  const feedModal = document.createElement('div');
  feedModal.className = 'feed-modal';
  
  const resStandard = await fetch(`/api/bookshelves/${placement.storyId}/standard`);

  const dataStandard = await resStandard.json();
  Object.values(dataStandard).forEach((shelf) => {
      const shelfDiv = document.createElement('div')
      shelfDiv.className = 'standard-shelf';
      if (shelf.name === 'Want To Read') shelfDiv.classList.add('bold-shelf')
      shelfDiv.id = shelf.id;
      shelfDiv.dataset.storyId = placement.storyId;
      shelfDiv.innerText = shelf.name;
      // new event listener. is this right?
      shelfDiv.addEventListener('click', standardShelfEvent);
      feedModal.appendChild(shelfDiv)
  })

  const resCustom = await fetch(`/api/bookshelves/${placement.storyId}/custom`);

  const dataCustom = await resCustom.json();

  Object.values(dataCustom).forEach((shelf) => {
      const shelfContainer = document.createElement('div');
      shelfContainer.className = 'nonstandard-shelf-container';
      shelfContainer.id = shelf.id;
      shelfContainer.dataset.shelfId = placement.storyId;
      shelfContainer.addEventListener('click', customShelfEvent);
      const shelfCheckbox = document.createElement('input');
      shelfCheckbox.type = 'checkbox';
      shelfCheckbox.className = 'nonstandard-shelf-checkbox';
      if (shelf.Stories[0]) shelfCheckbox.checked = true;
      shelfContainer.appendChild(shelfCheckbox);
      const shelfDiv = document.createElement('div')
      shelfDiv.className = 'standard-shelf';
      shelfDiv.id = shelf.id;
      shelfDiv.innerText = shelf.name;
      shelfContainer.appendChild(shelfDiv);
      feedModal.appendChild(shelfContainer)
  })
  modalContainer.appendChild(feedModal)
  parent.appendChild(modalContainer)
}

const wtrButtons = document.querySelectorAll('.feed-bookshelf-wtr-button');

wtrButtons.forEach(button => button.addEventListener('click', wtrEvent))

const standardShelfButtons = document.querySelectorAll('.feed-modal > .standard-shelf')

standardShelfButtons.forEach(button => button.addEventListener('click', standardShelfEvent))

const customShelfButtons = document.querySelectorAll('.nonstandard-shelf-container');

customShelfButtons.forEach(button => button.addEventListener('click', customShelfEvent))