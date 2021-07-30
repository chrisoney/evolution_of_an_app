window.addEventListener("load", (event) => {
    const mode = document.querySelector('.mode-container').id;
    if (parseInt(mode) === 0) {
        console.log("hello from javascript!")
    }
})

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

    const modalButton = document.createElement('i');
    modalButton.className = 'feed-modal-button fas fa-chevron-down';
    // Add the event listener for the modal button here
    parent.appendChild(modalButton)
}

const wtr_buttons = document.querySelectorAll('.feed-bookshelf-wtr-button');

wtr_buttons.forEach(button => button.addEventListener('click', wtrEvent))