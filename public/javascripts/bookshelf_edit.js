const add_button = document.querySelector('.new-shelf-submit');
const new_input_field = document.querySelector('.new-shelf-input');
const existing_shelves = document.querySelectorAll('.shelf-name');
const tableBody = document.querySelector('tbody')
add_button.addEventListener('click', async (e) => {
  const newName = new_input_field.value;
  if (Array.prototype.slice.call(existing_shelves).map(shelf => shelf.name).includes(newName)) {
    alert("Shelf couldn't be created. Shelf name is either invalid or a duplicate.");
    return;
  }
  const res = await fetch('/api/bookshelves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name:newName})
  })
  const { bookshelf } = await res.json();
  const newRow = `
    <tr>
      <td>${bookshelf.deleteAllowed ? `<i class="fas fa-times delete-shelf" id=${bookshelf.id} />` : ''}</td>
      <td class='shelf-name'>${bookshelf.name}</td>
      <td class="editable-container">
        <i class="editable fas ${bookshelf.deleteAllowed ? 'fa-check' : 'fa-times'}"/>
      </td>
    </tr>
  `
  tableBody.innerHTML = tableBody.innerHTML + newRow;
})