import { starClickEvent, starHoverEvent, starContainerEvent } from './events/star_events.js';

const description_expand_button = document.querySelector('.expand');
const warning_toggle = document.querySelector('.warnings-toggle')
const selectedCustomShelves = new Set();

if (warning_toggle) {
  warning_toggle.addEventListener('click', (e) => {
    const warningsList = e.target.nextSibling;
    warningsList.classList.toggle('hidden');
    const toggleButton = e.target;
    if (toggleButton.innerText === 'Reveal Warnings') {
      toggleButton.innerText = 'Hide Warnings';
    } else {
      toggleButton.innerText = 'Reveal Warnings';
    }
  })
}

description_expand_button.addEventListener('click', (e) => {
  const button = e.target;
  const description = button.previousSibling;
  description.classList.remove('shortened');
  button.classList.add('hidden')
})

const closeModal = (e) => {
  // e.stopPropagation()
  // e.preventDefault()
  const ele = document.querySelector('.modal-section');
  if (!ele.classList.contains('hidden')) {
    ele.children[1].classList.add('zoom-out');
    window.setTimeout(() => {
      ele.classList.add('hidden');
      ele.children[1].classList.remove('zoom-out');
      ele.children[1].innerHTML = '';
    }, 400);
  }
}

const customShelfEvent = (e) => {
  const ele = e.target;
  const id = parseInt(ele.id)
  if (ele.classList.contains('modal-custom-shelf')) {
    if (selectedCustomShelves.has(id)) {
      ele.classList.toggle('selected');
      selectedCustomShelves.delete(id);
    } else {
      ele.classList.toggle('selected');
      selectedCustomShelves.add(id);
    }
  }
}

const wantToReadFunction = async (e) => {
  e.stopPropagation()
  const bookshelfId = e.target.id;
  const storyId = document.querySelector('.story-id-container').id;
  const res = await fetch('/api/placements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bookshelfId, storyId})
  })

  if (res.ok) {
    const { placement } = await res.json();

    const parent = e.target.parentElement;
    parent.classList.add('added');
    parent.innerHTML = ''
    const icon = document.createElement('i');
    icon.className = 'fas fa-check';
    parent.appendChild(icon);

    const bookshelfDiv = document.createElement('div');
    bookshelfDiv.className = 'bookshelf-button-added';
    bookshelfDiv.id = placement.bookshelfId;
    bookshelfDiv.innerText = 'Want To Read'
    parent.appendChild(bookshelfDiv);

    parent.addEventListener('click', switchBookshelfChoice)
  }
}

const selectBookshelf = async (e) => {
  e.stopPropagation()
  const bookshelfId = e.target.id;
  const storyId = document.querySelector('.story-id-container').id;
  const res = await fetch('/api/placements/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bookshelfId, storyId})
  })
  if (res.ok) {
    const { placement } = await res.json();

    const parent = document.querySelector('.bookshelf-button-container');
    parent.classList.add('added');
    parent.innerHTML = ''
    const icon = document.createElement('i');
    icon.className = 'fas fa-check';
    parent.appendChild(icon);

    const bookshelfDiv = document.createElement('div');
    bookshelfDiv.className = 'bookshelf-button-added';
    bookshelfDiv.id = e.target.id;
    bookshelfDiv.innerText = e.target.innerText;
    parent.appendChild(bookshelfDiv);

    closeModal();
  }
}

const customShelfSubmitEvent = async (e) => {
  const arr = Array.from(selectedCustomShelves)
  for (let i = 0; i < arr.length; i++){
    const bookshelfId = arr[i];
    const storyId = document.querySelector('.story-id-container').id;
    const res = await fetch('/api/placements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookshelfId, storyId })
    })
    if (!res.ok) {
      console.log('WHOOPS')
    }
  }
  selectedCustomShelves.clear();
  closeModal();
}

const switchShelfHelperEvent = async (e) => {
  e.stopPropagation()
  const ele = e.target;
  if (!ele.classList.contains('modal-bookshelf-button') || ele.classList.contains('selected')) {
    return;
  }
  const bookshelfId = ele.id;
  const storyId = document.querySelector('.story-id-container').id;
  const res = await fetch('/api/placements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bookshelfId, storyId})
  })
  if (res.ok) {
    const { placement, bookshelf } = await res.json();
    const parent = ele.parentElement;
    const buttons = parent.querySelectorAll('.modal-bookshelf-button');
    for (let i = 0; i < buttons.length; i++){
      const button = buttons[i];
      if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        button.children[0].remove();
      }
    }
    ele.classList.add('selected');
    ele.innerHTML = '<i class="fas fa-check"></i>' + ele.innerHTML;
    const otherBookshelfButton = document.querySelector('.bookshelf-button-added');
    otherBookshelfButton.id = bookshelf.id;
    otherBookshelfButton.innerText = bookshelf.name;
  }
  return;
}

const firstStoryModal = (data, large) => {
  const result = [];

  const titleContainer = document.createElement('div')
  titleContainer.className = 'modal-title-container';
  const title = document.createElement('div');
  title.className = 'modal-title';
  title.innerText = 'Choose a shelf for this story: ';
  titleContainer.appendChild(title);
  const closeButtonContainer = document.createElement('i');
  closeButtonContainer.className = 'close-button-container';
  closeButtonContainer.addEventListener('click', closeModal)
  const closeButton = document.createElement('i');
  closeButton.className = 'fas fa-times close-modal';
  closeButtonContainer.appendChild(closeButton);
  titleContainer.appendChild(closeButtonContainer);
  result.push(titleContainer);
  
  const wantToRead = document.createElement('button');
  wantToRead.className = 'modal-bookshelf-button';
  wantToRead.id = data['Want To Read'].id;
  wantToRead.innerText = 'Want To Read';
  if (large) {
    wantToRead.addEventListener('click', switchShelfHelperEvent)
    if( data['Want To Read'].Stories.length > 0) {
      wantToRead.classList.add('selected');
      wantToRead.innerHTML = '<i class="fas fa-check"></i>' + wantToRead.innerHTML;
    }
  }  else {
    wantToRead.addEventListener('click', selectBookshelf)
  }
  result.push(wantToRead);

  const currentlyReading = document.createElement('button');
  currentlyReading.className = 'modal-bookshelf-button';
  currentlyReading.id = data['Currently Reading'].id;
  currentlyReading.innerText = 'Currently Reading';
  if (large) {
    currentlyReading.addEventListener('click', switchShelfHelperEvent)
    if (data['Currently Reading'].Stories.length > 0) {
      currentlyReading.classList.add('selected');
      currentlyReading.innerHTML = '<i class="fas fa-check"></i>' + currentlyReading.innerHTML;
    }
  } else {
    currentlyReading.addEventListener('click', selectBookshelf)
  }
  result.push(currentlyReading);

  const alreadyRead = document.createElement('button');
  alreadyRead.className = 'modal-bookshelf-button';
  alreadyRead.id = data['Read'].id;
  alreadyRead.innerText = 'Read';
  if (large) {
    alreadyRead.addEventListener('click', switchShelfHelperEvent)
    if(data['Read'].Stories.length > 0) {
      alreadyRead.classList.add('selected');
      alreadyRead.innerHTML = '<i class="fas fa-check"></i>' + alreadyRead.innerHTML;
    }
  } else {
    alreadyRead.addEventListener('click', selectBookshelf)
  }
  result.push(alreadyRead);

  if (large) {
    const bottomButtonContainer = document.createElement('div');
    bottomButtonContainer.className = 'modal-bottom-button-container';
    const cancelButton = document.createElement('button');
    cancelButton.className = 'modal-cancel';
    cancelButton.innerText = 'Remove';
    cancelButton.addEventListener('click', removeAllWarningEvent);
    bottomButtonContainer.appendChild(cancelButton);
    const submitButton = document.createElement('button');
    submitButton.className = 'modal-submit';
    submitButton.innerText = 'Next';
    submitButton.addEventListener('click', customShelfModalDisplayEvent);
    bottomButtonContainer.appendChild(submitButton);
    result.push(bottomButtonContainer);
  }

  return result;
}

const secondStoryModal = (data) => {
  const result = [];

  const titleContainer = document.createElement('div')
  titleContainer.className = 'modal-title-container';
  const title = document.createElement('div');
  title.className = 'modal-title';
  title.innerText = 'Add this story to some of your custom shelves: ';
  titleContainer.appendChild(title);
  const closeButtonContainer = document.createElement('i');
  closeButtonContainer.className = 'close-button-container';
  closeButtonContainer.addEventListener('click', closeModal)
  const closeButton = document.createElement('i');
  closeButton.className = 'fas fa-times close-modal';
  closeButtonContainer.appendChild(closeButton);
  titleContainer.appendChild(closeButtonContainer);
  result.push(titleContainer);

  const shelfContainer = document.createElement('div');
  shelfContainer.className = 'modal-shelf-container';
  for (let i = 0; i < Object.values(data).length; i++) {
    const shelf = Object.values(data)[i]
    const customShelfDiv = document.createElement('div');
    customShelfDiv.className = 'modal-custom-shelf';
    customShelfDiv.innerText = shelf.name;
    customShelfDiv.id = shelf.id;
    if (shelf.Stories.length > 0) {
      customShelfDiv.classList.add('selected');
    }
    customShelfDiv.addEventListener('click', customShelfEvent);
    shelfContainer.appendChild(customShelfDiv)
  }
  result.push(shelfContainer);

  const bottomButtonContainer = document.createElement('div');
  bottomButtonContainer.className = 'modal-bottom-button-container';
  const cancelButton = document.createElement('button');
  cancelButton.className = 'modal-cancel';
  cancelButton.innerText = 'Back';
  cancelButton.addEventListener('click', switchBookshelfChoice)
  bottomButtonContainer.appendChild(cancelButton);
  const submitButton = document.createElement('button');
  submitButton.className = 'modal-submit';
  submitButton.innerText = 'Done';
  submitButton.addEventListener('click', customShelfSubmitEvent);
  bottomButtonContainer.appendChild(submitButton);
  result.push(bottomButtonContainer);

  return result;

}

const removeFromAllModal = () => {
  const result = [];

  const titleContainer = document.createElement('div')
  titleContainer.className = 'modal-title-container';
  const title = document.createElement('div');
  title.className = 'modal-title';
  title.innerText = 'Are you sure you want to remove this book from your shelves? ';
  titleContainer.appendChild(title);
  const closeButtonContainer = document.createElement('i');
  closeButtonContainer.className = 'close-button-container';
  closeButtonContainer.addEventListener('click', closeModal)
  const closeButton = document.createElement('i');
  closeButton.className = 'fas fa-times close-modal';
  closeButtonContainer.appendChild(closeButton);
  titleContainer.appendChild(closeButtonContainer);
  result.push(titleContainer);

  const warningDescription = document.createElement('div');
  warningDescription.className = 'modal-description';
  warningDescription.innerText = 'Removing this book will clear associated reading activity.'
  result.push(warningDescription);

  const bottomButtonContainer = document.createElement('div');
  bottomButtonContainer.className = 'modal-bottom-button-container';
  const cancelButton = document.createElement('button');
  cancelButton.className = 'modal-cancel';
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', switchBookshelfChoice)
  bottomButtonContainer.appendChild(cancelButton);
  const submitButton = document.createElement('button');
  submitButton.className = 'modal-submit';
  submitButton.innerText = 'Remove';
  submitButton.addEventListener('click', removeAllSubmitEvent);
  bottomButtonContainer.appendChild(submitButton);
  result.push(bottomButtonContainer);

  return result;
}

const removeAllWarningEvent = () => {
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.innerHTML = ''
  const eles = removeFromAllModal();

  for (let i = 0; i < eles.length; i++){
    modalContainer.appendChild(eles[i]);
  }
}

const removeAllSubmitEvent = async () => {
  const storyId = document.querySelector('.story-id-container').id;

  const res = await fetch('/api/placements/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ storyId })
  })
  if (res.ok) {
    const otherButton = document.querySelector('.bookshelf-button-container.added')
    otherButton.classList.remove('added');
    otherButton.innerHTML = '';

    const resTwo = await fetch(`/api/bookshelves/${storyId}/standard`)
    const data = await resTwo.json();
    const placeholderDiv = document.createElement('div');
    placeholderDiv.className = 'placeholder';
    otherButton.appendChild(placeholderDiv)

    const wantToReadDiv = document.createElement('div');
    wantToReadDiv.className = 'bookshelf-button';
    wantToReadDiv.id = data['Want To Read'].id;
    wantToReadDiv.innerText = 'Want To Read';
    wantToReadDiv.addEventListener('click', wantToReadFunction);
    otherButton.appendChild(wantToReadDiv);

    const icon = document.createElement('i');
    icon.className = 'fas fa-chevron-down';
    icon.addEventListener('click', selectBookshelfChevronFunction);
    otherButton.appendChild(icon);

    closeModal();
  }
}

const customShelfModalDisplayEvent = async () => {
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.innerHTML = ''
  
  const storyId = document.querySelector('.story-id-container').id
  const res = await fetch(`/api/bookshelves/${storyId}/custom`)

  const data = await res.json();
  const eles = secondStoryModal(data);

  for (let i = 0; i < eles.length; i++){
    modalContainer.appendChild(eles[i]);
  }
}

const switchBookshelfChoice = async (e) => {
  e.stopPropagation()
  const modalContainer = document.querySelector('.modal-container');
  if (modalContainer.parentElement.classList.contains('hidden')) {
    modalContainer.parentElement.classList.remove('hidden');
    modalContainer.previousSibling.addEventListener('click', closeModal);
  } else {
    modalContainer.innerHTML = '';
  }

  const storyId = document.querySelector('.story-id-container').id
  const res = await fetch(`/api/bookshelves/${storyId}/standard`)

  const data = await res.json();
  const eles = firstStoryModal(data, true);

  for (let i = 0; i < eles.length; i++){
    modalContainer.appendChild(eles[i]);
  }
}

const selectBookshelfChevronFunction = async (e) => {
  e.stopPropagation()
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.parentElement.classList.remove('hidden');
  modalContainer.previousSibling.addEventListener('click', closeModal);

  const storyId = document.querySelector('.story-id-container').id
  const res = await fetch(`/api/bookshelves/${storyId}/standard`)

  const data = await res.json();
  
  const eles = firstStoryModal(data, false);

  for (let i = 0; i < eles.length; i++){
    modalContainer.appendChild(eles[i]);
  }
}

// These will exist
const want_to_read_button = document.querySelector('.bookshelf-button');
const select_bookshelf_chevron_button = document.querySelector('.fa-chevron-down');
// Or this will exist  
const change_bookshelf_button = document.querySelector('.bookshelf-button-container.added');
if (want_to_read_button && select_bookshelf_chevron_button) {
  want_to_read_button.addEventListener('click', wantToReadFunction);
  select_bookshelf_chevron_button.addEventListener('click', selectBookshelfChevronFunction);
} else {
  change_bookshelf_button.addEventListener('click', switchBookshelfChoice)
}

// Rating section

const user_stars = document.querySelectorAll('.fa-star.user-rating');
const star_container = user_stars[0].parentElement;

user_stars.forEach((button) => button.addEventListener('click', starClickEvent))
user_stars.forEach((button) => button.addEventListener('mouseover', starHoverEvent))

star_container.addEventListener('mouseout', starContainerEvent);


// Review content section
const review_content = document.querySelector('.user-review-content')

const reveal_form_button = document.querySelector('.reveal-form')

if (reveal_form_button) {
  reveal_form_button.addEventListener('click', (e) => {
    e.target.classList.add('hidden');
    const form = document.querySelector('.user-review-form-section')
    form.classList.remove('hidden')
  })
}
const cancel_form_button = document.querySelector('.cancel-review-content-button')

cancel_form_button.addEventListener('click', (e) => {
  e.target.parentElement.previousSibling.value = '';
  e.target.parentElement.parentElement.classList.add('hidden')
  if (reveal_form_button) {
    reveal_form_button.classList.remove('hidden')
  }
})

const submit_form_button = document.querySelector('.submit-review-content-button')

submit_form_button.addEventListener('click', async (e) => {
  const content = e.target.parentElement.previousSibling.value;
  if (content === '') return;
  const storyId = e.target.dataset.storyId;
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content, storyId })
  })
  if (res.ok) {
    e.target.parentElement.parentElement.classList.add('hidden');
    if (reveal_form_button) {
      reveal_form_button.remove()
      review_content.innerText = content;
      review_content.classList.remove('hidden')
    }
  }
})