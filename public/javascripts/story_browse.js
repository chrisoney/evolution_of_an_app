const tag_section_reveal_button = document.querySelector('.tag-section-reveal');
if (tag_section_reveal_button) {
  tag_section_reveal_button.addEventListener('click', (e) => {
    if (e.target.innerText === 'Filter by Tags') {
      e.target.innerText = 'Close';
    } else {
      e.target.innerText = 'Filter by Tags';
    }
    document.querySelector('.tag-section').classList.toggle('hidden')
  })
}
const tagsSelected = new Set();

const preSelected = document.querySelector('.selected-tag')
if (preSelected && preSelected.id !== '') {
  tagsSelected.add(preSelected.id)
  console.log(tagsSelected)
}

const checkboxEvent = async (e) => {
  // e.preventDefault()
  const ele = e.currentTarget;
  if (e.target.className !== 'tag-checkbox') {
    ele.children[0].checked = !ele.children[0].checked;
  }
  const tag = ele.children[1].innerText;
  if (tagsSelected.has(tag)) tagsSelected.delete(tag);
  else tagsSelected.add(tag);
  const res = await fetch('/api/stories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tags: Array.from(tagsSelected)})
  })
  const { stories } = await res.json();

  const storyContainer = document.querySelector('.left-story-container');
  storyContainer.innerHTML = ''
  for (let i = 0; i < stories.length; i++){
    const story = stories[i];
    const linkEle = document.createElement('a');
    linkEle.href = `/stories/${story.id}`
    const imgEle = document.createElement('img');
    imgEle.src = story.imageUrl;
    imgEle.className = 'story-browse-image';
    linkEle.appendChild(imgEle);
    storyContainer.appendChild(linkEle);
  }
}

const checkbox_containers = document.querySelectorAll('.tag-container');

checkbox_containers.forEach(button => button.addEventListener('click', checkboxEvent))