const description_expand_button = document.querySelector('.expand');

description_expand_button.addEventListener('click', (e) => {
  const button = e.target;
  const description = button.previousSibling;
  description.classList.remove('shortened');
  button.classList.add('hidden')
})

const closeModal = (e) => {
  const ele = e.target;
  if (ele.classList.contains('modal-background') && !ele.classList.contains('hidden')) {
    ele.children[0].classList.add('zoom-out');
    window.setTimeout(() => {
      ele.classList.add('hidden');
      ele.children[0].classList.remove('zoom-out');
      ele.children[0].innerHTML = '';
    }, 400);
  }
}

const wantToReadFunction = async (e) => {
  const bookshelfId = e.target.id;
  const storyId = document.querySelector('.story-id-container').id
  const res = await fetch('/api/placements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bookshelfId, storyId})
  })

  if (res.ok) {
    const { placement } = await res.json();

    // i(class='fas fa-check')
    // div(class='bookshelf-button-added' id=story.Bookshelves[0].id)
    // | #{story.Bookshelves[0].name}
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

    // parent.addEventListener('click', changeBookshelfFunction)
  }
}

const selectBookshelfChevronFunction = async (e) => {
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.parentElement.classList.remove('hidden');
  modalContainer.parentElement.addEventListener('click', closeModal);

  const titleContainer = document.createElement('div')
  titleContainer.className = 'modal-title-container';
  const title = document.createElement('div');
  title.className = 'modal-title';
  title.innerText = 'Choose a shelf for this story: ';
  titleContainer.appendChild(title);
  const closeButton = document.createElement('i');
  closeButton.className = 'fas fa-times';
  titleContainer.appendChild(closeButton);
  modalContainer.appendChild(titleContainer);

  const res = await fetch('/api/bookshelves/')

  const data = await res.json();
  
  const wantToRead = document.createElement('button');
  wantToRead.className = 'modal-bookshelf-button';
  wantToRead.id = data['Want To Read'];
  wantToRead.innerText = 'Want To Read';
  modalContainer.appendChild(wantToRead);

  const currentlyReading = document.createElement('button');
  currentlyReading.className = 'modal-bookshelf-button';
  currentlyReading.id = data['Currently Reading'];
  currentlyReading.innerText = 'Currently Reading';
  modalContainer.appendChild(currentlyReading);

  const alreadyRead = document.createElement('button');
  alreadyRead.className = 'modal-bookshelf-button';
  alreadyRead.id = data['Read'];
  alreadyRead.innerText = 'Read';
  modalContainer.appendChild(alreadyRead);

}

// These will exist
const want_to_read_button = document.querySelector('.bookshelf-button');
const select_bookshelf_chevron_button = document.querySelector('.fa-chevron-down');
if (want_to_read_button && select_bookshelf_chevron_button) {
  want_to_read_button.addEventListener('click', wantToReadFunction);
  select_bookshelf_chevron_button.addEventListener('click', selectBookshelfChevronFunction);
}
// Or this will exist  
const change_bookshelf_button = document.querySelector('.bookshelf-button-container.added');