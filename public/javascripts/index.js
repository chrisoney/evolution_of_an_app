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
        shelfDiv.innerText = shelf.name;
        // Event listener for shelf addition
        feedModal.appendChild(shelfDiv)
    })

    const resCustom = await fetch(`/api/bookshelves/${placement.storyId}/custom`);

    const dataCustom = await resCustom.json();

    Object.values(dataCustom).forEach((shelf) => {
        const shelfContainer = document.createElement('div');
        shelfContainer.className = 'nonstandard-shelf-container';
        const shelfCheckbox = document.createElement('input');
        shelfCheckbox.type = 'checkbox';
        if (shelf.Stories[0]) shelfCheckbox.checked = true;
        shelfContainer.appendChild(shelfCheckbox);
        const shelfDiv = document.createElement('div')
        shelfDiv.className = 'standard-shelf';
        shelfDiv.id = shelf.id;
        shelfDiv.innerText = shelf.name;
        shelfContainer.appendChild(shelfDiv);
        // Event listener for shelf addition
        feedModal.appendChild(shelfContainer)
    })
    modalContainer.appendChild(feedModal)
    parent.appendChild(modalContainer)
}

const wtr_buttons = document.querySelectorAll('.feed-bookshelf-wtr-button');

wtr_buttons.forEach(button => button.addEventListener('click', wtrEvent))