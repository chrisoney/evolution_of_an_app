const express = require('express');
const router = express.Router();
const { User, Bookshelf, Story, Placement, Sequelize, sequelize } = require('../db/models');
const { Op } = Sequelize;
const { asyncHandler } = require('./utils')


/* GET home page. */
router.get('/', asyncHandler(async (req, res,) => {
  let currentlyReadingUsers = [];
  let customBookshelfUsers = [];
  let currentUserBookshelfIds = {}
  let userInfo, feed;
  if (req.session.auth) {
    userInfo = await User.findByPk(req.session.auth.userId, {
      attributes: { exclude : ['hashedPassword']},
      include: {
        model: Bookshelf,
        include: Story
      }
    })
    for (let x = 0; x < Object.values(userInfo.Bookshelves).length; x++){
      const shelf = Object.values(userInfo.Bookshelves)[x];
      for (let y = 0; y < Object.values(shelf.Stories).length; y++){
        const story = Object.values(shelf.Stories)[y];
        if (!currentUserBookshelfIds[shelf.name]) currentUserBookshelfIds[shelf.name] = { id: shelf.id, name: shelf.name, standard: !shelf.deleteAllowed, stories: []};
        currentUserBookshelfIds[shelf.name].stories.push(story.id)
      }
    }
    feed = await Placement.findAll({
      order: [['updatedAt', 'DESC']],
      include: [Story, {
        model: Bookshelf,
        where: { name: ['Want To Read','Currently Reading', 'Read']},
        include: {
          model: User,
          attributes: { exclude: ['hashedPassword'] },
          where: { id: {[Op.ne]: req.session.auth.userId} }
        },
      }],
      limit: 10
    })
  } else {
    currentlyReadingUsers = await User.findAll({
      attributes: { exclude : ['hashedPassword']},
      include: {
        model: Bookshelf,
        where: { name: 'Currently Reading' },
        include: Story
      },
      order: sequelize.random(),
      limit: 2
    })
    customBookshelfUsers = await User.findAll({
      attributes: { exclude : ['hashedPassword']},
      include: {
        model: Bookshelf,
        where: { deleteAllowed: true },
        include: Story
      },
      order: sequelize.random(),
      limit: 7
    })
  }
  res.render('index', {
    title: res.locals.mode === '0' ? 'a/A Express Skeleton Home' : 'RoyalReads',
    currentlyReadingUsers,
    customBookshelfUsers,
    userInfo,
    feed,
    currentUserBookshelfIds
  });
  // res.json({ test: userInfo })
}));

router.get('/search', asyncHandler(async (req, res) => {
  const term = req.query.term;

  const stories = await Story.findAll({
    where: {
      [Op.or]: [{
        title: {
          [Op.iLike]: `%${term}%`
        }
      },
      {
        description: {
          [Op.iLike]: `%${term}%`
        }
      }]
    }
  })
  res.json({ stories })
}))

module.exports = router;
