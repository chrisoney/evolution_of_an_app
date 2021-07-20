const csrf = require('csurf');
const { Placement, Story, sequelize } = require('../db/models');
const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const authPages = ['/users/login', '/users/signup']
const bookShelfPages = [/users\/\d+\/bookshelves/,/bookshelves\/edit/]
const storiesPages = [/stories\/\d+/]

const pageChecker = (req, res, next) => {
  const url = req.originalUrl;
  console.log('hit')
  if (parseInt(res.locals.mode) < 3) {
    for (let i = 0; i < storiesPages.length; i++){
      const regex = storiesPages[i];
      if (regex.exec(url)) return res.render('page-not-made', {title: 'Page Not Made'})
    }
  }
  else if (parseInt(res.locals.mode) < 2) {
    for (let i = 0; i < bookShelfPages.length; i++){
      const regex = bookShelfPages[i];
      if (regex.exec(url)) return res.render('page-not-made')
    }
  }
  if (authPages.includes(url) && res.locals.mode === '0') {
    res.render('page-not-made')
  }
  else if (req.method === 'POST' && res.locals.mode === '0') {
    res.render('page-not-made', {alert: 'alert("This version of the app didn\'t have this functionality. Switch to a newer version to see it")</script>'})
  }
  else {
    next()
  }
}

const addStories = async (shelves, num) => {
  const stories = await Story.findAll({
    order: sequelize.random(),
    limit: num + 6
  })
  const distribution = [1,3,2,num]
  for (let i = 0; i < shelves.length; i++){
    let shelf = shelves[i];
    let numStories = distribution[i];
    while (numStories > 0) {
      const story = stories.shift();
      await Placement.create({ bookshelfId: shelf.id, storyId: story.id })
      numStories -= 1;
    }
  }
}

module.exports = {
  csrfProtection,
  asyncHandler,
  pageChecker,
  addStories
};