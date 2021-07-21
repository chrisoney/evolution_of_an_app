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

document.querySelector('.modal-background').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-background')) {
    e.target.classList.add('hidden')
  }
})