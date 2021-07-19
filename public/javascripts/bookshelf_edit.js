const add_button = document.querySelector('.new-shelf-submit');
const new_input_field = document.querySelector('.new-shelf-input');

const table_body = document.querySelector('tbody');

const delete_all_button = document.querySelector('.delete-all');

const single_delete_buttons = document.querySelectorAll('.delete-shelf.allow');

const edit_start_buttons = document.querySelectorAll('.editable.fa-check');
const edit_submit_buttons = document.querySelectorAll('.shelf-name-update-submit');
const edit_cancel_buttons = document.querySelectorAll('.shelf-name-update-cancel');

delete_all_button.addEventListener('click', async (e) => {
  const ans = confirm("This will delete all your shelves. This will only delete non-exclusive shelves. Are you sure?")
  if (!ans) return;
  const shelf_rows = document.querySelectorAll('.shelf-row')
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
    
const singleDeleteFunction = async (e) => {
  const id = e.target.id;
  const res = await fetch(`/api/bookshelves/${id}`, {
    method: 'DELETE',
  })
  if (res.ok) {
    e.target.parentElement.parentElement.remove()
  }
}

single_delete_buttons
  .forEach((button) => button.addEventListener('click', singleDeleteFunction))
    
const editStartFunction = (e) => {
  const otherDetail = e.target.parentElement.previousSibling;
  const currentName = otherDetail.children[0];
  const editContainer = otherDetail.children[1];
  currentName.classList.toggle('hidden');
  editContainer.classList.toggle('hidden');

  if (editContainer.classList.contains('hidden')) {
    editContainer.children[0].value = currentName.innerText;
  }
}

edit_start_buttons
  .forEach((button) => button.addEventListener('click', editStartFunction));

const editSubmitFunction = async (e) => {
  const id = e.target.id;
  let name = e.target.previousSibling.value;
  if (name === '') return;
  else if (name.length > 30) name = name.slice(0, 30);

  const res = await fetch(`/api/bookshelves/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  })

  if (res.ok) {
    const { bookshelf } = await res.json();
    const parent = e.target.parentElement;
    const shelfNameEle = parent.previousSibling;
    shelfNameEle.innerText = bookshelf.name;
    parent.classList.toggle('hidden')
    shelfNameEle.classList.toggle('hidden')
  }
}

edit_submit_buttons
  .forEach((button) => button.addEventListener('click', editSubmitFunction));

const editCancelFunction = (e) => {
  const input = e.target.previousSibling.previousSibling;
  const parent = e.target.parentElement;
  const parentSibling = parent.previousSibling;
  input.value = parentSibling.innerText;
  parent.classList.toggle('hidden')
  parentSibling.classList.toggle('hidden')
}

edit_cancel_buttons
  .forEach((button) => button.addEventListener('click', editCancelFunction));

add_button.addEventListener('click', async (e) => {
  const newName = new_input_field.value;
  const existing_shelves = document.querySelectorAll('.shelf-name');
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

  // New Row
  const newRowEle = document.createElement('tr');
  newRowEle.className = 'shelf-row';
  newRowEle.dataset.editable = bookshelf.deleteAllowed ? 'true' : 'false';
  newRowEle.dataset.shelfId = bookshelf.id;

  // First table detail
  const firstTableDetail = document.createElement('td');
  firstTableDetail.className = 'delete-shelf-container';
  const firstIcon = document.createElement('i');
  firstIcon.className = `fas fa-times delete-shelf ${bookshelf.deleteAllowed ? 'allow' : ''}`;
  firstIcon.id = bookshelf.id;
  firstIcon.addEventListener('click', singleDeleteFunction);
  firstTableDetail.appendChild(firstIcon);

  // Second table detail
  const secondTableDetail = document.createElement('td');
  secondTableDetail.className = 'shelf-name';
  const nameDiv = document.createElement('div')
  nameDiv.innerText = bookshelf.name;
  const containerDiv = document.createElement('div');
  containerDiv.className = 'shelf-name-update-container hidden';
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.className = 'shelf-name-update-input';
  newInput.id = bookshelf.id;
  const submitButton = document.createElement('button');
  submitButton.className = 'shelf-name-update-submit';
  submitButton.id = bookshelf.id;
  submitButton.innerText = 'Save';
  submitButton.addEventListener('click', editSubmitFunction)
  const cancelButton = document.createElement('button');
  cancelButton.className = 'shelf-name-update-cancel';
  cancelButton.innerText = 'Cancel'
  cancelButton.addEventListener('click', editCancelFunction);

  containerDiv.appendChild(newInput);
  containerDiv.appendChild(submitButton);
  containerDiv.appendChild(cancelButton);
  secondTableDetail.appendChild(nameDiv)
  secondTableDetail.appendChild(containerDiv)

  // Third table detail
  const thirdTableDetail = document.createElement('td');
  thirdTableDetail.className = 'editable-container';
  const secondIcon = document.createElement('i');
  secondIcon.className = `editable fas ${bookshelf.deleteAllowed ? 'fa-check' : 'fa-times'}`;
  secondIcon.addEventListener('click', editStartFunction)
  thirdTableDetail.appendChild(secondIcon);

  newRowEle.appendChild(firstTableDetail);
  newRowEle.appendChild(secondTableDetail);
  newRowEle.appendChild(thirdTableDetail);

  table_body.appendChild(newRowEle);
})