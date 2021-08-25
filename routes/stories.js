const express = require('express');
const { asyncHandler } = require('./utils');
const { Story, Bookshelf, Placement, Review, User, Tag } = require('../db/models')
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const tag = req.query.selectedTag;
  let stories;
  if (tag) {
    stories = await Story.findAll({
      order: [['title']],
      include: {
        model: Tag,
        where: {
          name: tag
        }
      }
    });
  } else {
    stories = await Story.findAll({
      order: [['title']],
    });
  }

  const newStories = await Story.findAll({
    include: {
      model: Placement,
      order: [["createdAt", "DESC"]]
    },
    limit: 15,
  })

  const tags = await Tag.findAll();

  // res.json({stories})
  res.render('story-browse', { stories, newStories, tags })
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
      attributes: ['storyId', 'userId', 'content', 'rating', 'createdAt'],
      include: {
        model: User,
        attributes: ['id', 'username']
      },
      required: false
    }, {
      model: Tag
    }]
  });
  for (let i = 0; i < bookshelves.length; i++){
    if (bookshelves[i].name === 'Want To Read') wantToReadId = bookshelves[i].id;
  }
  return res.render('story-page', { story, wantToReadId, })
  // res.json({ story })
}))



module.exports = router;