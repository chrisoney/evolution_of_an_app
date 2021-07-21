const description_expand_button = document.querySelector('.expand');

description_expand_button.addEventListener('click', (e) => {
  const button = e.target;
  const description = button.previousSibling;
  description.classList.remove('shortened');
  button.classList.add('hidden')
})

const closeModal = (e) => {
  e.stopPropagation()
  e.preventDefault()
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
  }
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
    cancelButton.innerText = 'Cancel';
    bottomButtonContainer.appendChild(cancelButton);
    const submitButton = document.createElement('button');
    submitButton.className = 'modal-submit';
    submitButton.innerText = 'Submit';
    bottomButtonContainer.appendChild(submitButton);
    result.push(bottomButtonContainer);

    //bottom buttons
    //also consider doing the :before or whatever for the check mark
  }

  return result;
}

const switchBookshelfChoice = async (e) => {
  e.stopPropagation()
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.parentElement.classList.remove('hidden');
  modalContainer.previousSibling.addEventListener('click', closeModal);

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