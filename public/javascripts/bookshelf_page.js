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
  const name = new_bookshelf_input.value;
  // https://stackoverflow.com/questions/32765157/filter-or-map-nodelists-in-es6
  const otherNames = Array.prototype.slice.call(document.querySelectorAll('.bookshelf-selector')).map(ele => ele.innerText);
  if (name === '' || otherNames.includes(name)) {
    alert("Shelf couldn't be created. Shelf name is either invalid or a duplicate.");
    return
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
  bookshelf_container.appendChild(newBookshelf);
  add_bookshelf_button.classList.toggle('hidden')
  new_bookshelf_form_container.classList.toggle('hidden')
})