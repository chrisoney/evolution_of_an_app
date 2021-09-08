const csrf = require('csurf');
const { Placement, Story, sequelize } = require('../db/models');
const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const authPages = ['/users/login', '/users/signup']
const bookShelfPages = [/users\/\d+\/bookshelves/,/bookshelves\/edit/]
const storiesPages = [/stories\/\d+/, /stories/]
const searchPage = /^\/search/;

const pageChecker = (req, res, next) => {
  const url = req.originalUrl;
  if (parseInt(res.locals.mode) < 6) {
    if (searchPage.exec(url)) return res.render('page-not-made', {title: 'Page Not Made'})
  }
  if (parseInt(res.locals.mode) < 3) {
    for (let i = 0; i < storiesPages.length; i++){
      const regex = storiesPages[i];
      if (regex.exec(url)) return res.render('page-not-made', {title: 'Page Not Made'})
    }
  }
  if (parseInt(res.locals.mode) < 2) {
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

const addStories = async (shelves) => {
  const stories = await Story.findAll({
    order: sequelize.random(),
    limit: 6
  })
  const faveStories = stories.filter(story => story.id % 2 === 1)
  const otherShelf = shelves.pop();

  const distribution = [1,3,2]
  for (let i = 0; i < shelves.length; i++){
    let shelf = shelves[i];
    let numStories = distribution[i];
    while (numStories > 0) {
      const story = stories.shift();
      await Placement.create({ bookshelfId: shelf.id, storyId: story.id })
      numStories--;
    }
  }
  for (let j = 0; j < faveStories.length; j++){
    let story = faveStories[j];
    await Placement.create({ bookshelfId: otherShelf.id, storyId: story.id })
  }
}

const alterFeed = async () => {
  const random = await Placement.findAll({
    order: sequelize.random(),
    limit: 10,
  })
  for (let i = 0; i < random.length; i++){
    const placement = random[i]
    placement.changed('updatedAt', true)
    await placement.save();
  }
}

module.exports = {
  csrfProtection,
  asyncHandler,
  pageChecker,
  addStories,
  alterFeed
};