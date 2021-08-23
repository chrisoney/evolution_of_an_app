const starClickEvent = async (e) => {
  const parent = e.target.parentElement;
  const storyId = parent.dataset.storyId;
  const newRating = parseInt(e.target.dataset.score, 10);
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rating: newRating, storyId })
  })
  const { review: { rating } } = await res.json();

  for (let i = 0; i < parent.children.length; i++){
    const star = parent.children[i];
    star.classList.remove('fas');
    star.classList.remove('far');
    if (i < rating) {
      star.classList.add('fas');
    } else {
      star.classList.add('far');
    }
  }
  parent.dataset.currentRating = rating;
  // for (let j = 0; j < rating; j++){
  //   const star = parent.children[j];
  //   star.classList.add('fas')
  // }
  // for (let k = rating; i < 5; j++){

  // }

}

const starHoverEvent = (e) => {
  const parent = e.target.parentElement;
  const rating = parseInt(e.target.dataset.score, 10);
  for (let i = 0; i < parent.children.length; i++){
    const star = parent.children[i];
    star.classList.remove('fas');
    star.classList.remove('far');
    if (i < rating) {
      star.classList.add('fas');
    } else {
      star.classList.add('far');
    }
  }
}

const starContainerEvent = (e) => {
  const container = e.currentTarget;
  const currentRating = parseInt(container.dataset.currentRating, 10);
  for (let i = 0; i < container.children.length; i++){
    const star = container.children[i];
    star.classList.remove('fas');
    star.classList.remove('far');
    if (i < currentRating) {
      star.classList.add('fas');
    } else {
      star.classList.add('far');
    }
  }
}

export {
  starClickEvent,
  starHoverEvent,
  starContainerEvent
}