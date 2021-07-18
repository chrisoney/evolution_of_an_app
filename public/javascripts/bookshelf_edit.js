const add_button = document.querySelector('.new-shelf-submit');
const new_input_field = document.querySelector('.new-shelf-input');
const existing_shelves = document.querySelectorAll('.shelf-name');
const table_body = document.querySelector('tbody');

const delete_all_button = document.querySelector('.delete-all');
const shelf_rows = document.querySelectorAll('.shelf-row')

const single_delete_buttons = document.querySelectorAll('.delete-shelf');

const edit_start_buttons = document.querySelectorAll('.editable.fa-check');
const edit_submit_buttons = document.querySelectorAll('.shelf-name-update-submit');
const edit_cancel_buttons = document.querySelectorAll('.shelf-name-update-cancel');

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
  table_body.innerHTML = table_body.innerHTML + newRow;
})

delete_all_button.addEventListener('click', async (e) => {
  const ans = confirm("This will delete all your shelves. This will only delete non-exclusive shelves. Are you sure?")
  if (!ans) return;

  const newArr = Array.prototype.slice.call(shelf_rows).filter((row) => {
    return row.dataset.editable === 'true'
  })
  for (let i = 0; i < newArr.length; i++){
    const shelf = newArr[i];
    const res = await fetch(`/api/bookshelves/${shelf.dataset.shelfId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      shelf.remove()
    }
  }
})

single_delete_buttons
  .forEach((button) => button.addEventListener('click', async (e) => {
    const id = e.target.id;
    const res = await fetch(`/api/bookshelves/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      e.target.parentElement.parentElement.remove()
    }
  }))

edit_start_buttons
  .forEach((button) => button.addEventListener('click', (e) => {
    const otherDetail = e.target.parentElement.previousSibling;
    const currentName = otherDetail.children[0];
    const editContainer = otherDetail.children[1];
    currentName.classList.toggle('hidden');
    editContainer.classList.toggle('hidden');

    if (editContainer.classList.contains('hidden')) {
      editContainer.children[0].value = ''
    }
  }))


edit_cancel_buttons
  .forEach((button) => button.addEventListener('click', (e) => {
    const input = e.target.previousSibling.previousSibling;
    input.value = '';
    console.log(input)
    const parent = e.target.parentElement;
    const parentSibling = parent.previousSibling;
    parent.classList.toggle('hidden')
    parentSibling.classList.toggle('hidden')
  }))