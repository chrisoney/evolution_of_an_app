const express = require('express');
const { asyncHandler, pageChecker } = require('./utils');
const { Story, Bookshelf, Placement, Review, User } = require('../db/models')
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const stories = await Story.findAll({
    order: [['title']],
  });

  const newStories = await Story.findAll({
    include: {
      model: Placement,
      order: [["createdAt", "DESC"]]
    },
    limit: 15,
  })

  // res.json({newStories})
  res.render('story-browse', { stories, newStories })
}))

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = req.params.id;
  let wantToReadId;
  const bookshelves = await Bookshelf.findAll({
    where: { userId: req.session.auth.userId }
  })
  const story = await Story.findByPk(id, {
    include: [{
      model: Bookshelf,
      where: { userId: req.session.auth.userId },
      required: false
    }, {
      model: Review,
      include: {
        model: User,
        attributes: {
          exclude: ['hashedPassword']
        }
      }
    }]
  });
  for (let i = 0; i < bookshelves.length; i++){
    if (bookshelves[i].name === 'Want To Read') wantToReadId = bookshelves[i].id;
  }
  res.render('story-page', { story, bookshelves, wantToReadId })
  // res.json({ story })
}))



module.exports = router;