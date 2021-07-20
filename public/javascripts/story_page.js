const description_expand_button = document.querySelector('.expand');

description_expand_button.addEventListener('click', (e) => {
  const button = e.target;
  const description = button.previousSibling;
  description.classList.remove('shortened');
  button.classList.add('hidden')
})