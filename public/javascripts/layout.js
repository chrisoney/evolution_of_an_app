const buttons = document.querySelectorAll('.switch-stage');
buttons.forEach((button) => button.addEventListener('click', async (e) => {
  const stage = e.target.dataset.stage;
  const res = await fetch('/api/ui/stage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stage })
  })
  if (res.ok) {
    window.location.reload();
  }
}));

const user_menu_toggle_button = document.querySelector('.user-dropdown-button');
const user_menu = document.querySelector('.user-options');

if (user_menu_toggle_button) {
  user_menu_toggle_button.addEventListener('click', (e) => {
    user_menu.classList.toggle('hidden')
  })
}

const stage_selector_button = document.querySelector('.burger');
const grandparent = stage_selector_button.parentElement.parentElement;
stage_selector_button.addEventListener('click', (e) => {
  if (!grandparent.classList.contains('slide-out') &&
      !grandparent.classList.contains('slide-in')) {
    grandparent.classList.add('slide-out')
  } else {
    grandparent.classList.toggle('slide-out')
    grandparent.classList.toggle('slide-in')
  }
})

stage_selector_button.addEventListener('dragend', (e) => {
  const currTop = getComputedStyle(grandparent).top
  const newTop = `calc(${currTop} + ${e.offsetY}px)`;
  grandparent.style.top = newTop;
})

const mode_container = document.querySelector('.mode-container');
const newUser = mode_container.dataset.newUser;
if (newUser === 'true') {
  const modal_container = document.querySelector('.modal-container');
  modal_container.parentElement.classList.toggle('hidden');
  modal_container.previousSibling.addEventListener('click', (e) => {
    e.target.parentElement.classList.toggle('hidden')
  })

  const info_container = document.createElement('div');
  info_container.className = 'info-container modal-version';

  const top_section = document.createElement('div');
  top_section.className = 'top-section';

  const title = document.createElement('div');
  title.className = 'pnf-title';
  title.innerText = 'Welcome to RoyalReads!';
  top_section.appendChild(title);

  const description = document.createElement('div');
  description.className = 'pnf-description';
  description.innerText = 'If this modal appeared, you might be a new user. This site is meant to look like a GoodReads clone at several different stages of development.';
  top_section.appendChild(description);

  info_container.appendChild(top_section);

  const mid_section = document.createElement('div');
  mid_section.className = 'mid-section';
  
  const mode_description = document.createElement('div');
  mode_description.className = 'pnf-mode-description';
  mode_description.innerText = 'You can click the sandwich button the left hand side of the page to reveal the different iterations of this app. You can click the names of the iterations to see what a page looks like at that stage of development. \n\n Sometimes the page would not have existed at that stage, so you will need to switch back to a later iteration to continue navigating through the site. You can also drag the button up and down to move it out of the way if it overlaps with a feature.'
  mid_section.appendChild(mode_description);

  info_container.appendChild(mid_section);

  modal_container.appendChild(info_container);
}