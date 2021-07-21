const description_expand_button = document.querySelector('.expand');

description_expand_button.addEventListener('click', (e) => {
  const button = e.target;
  const description = button.previousSibling;
  description.classList.remove('shortened');
  button.classList.add('hidden')
})

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

const selectBookshelfChevronFunction = (e) => {
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.parent.classList.remove('hidden');

  
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