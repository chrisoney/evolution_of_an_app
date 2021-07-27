const express = require('express');
const router = express.Router();
const { User, Bookshelf, Story, Placement, sequelize } = require('../db/models');
const { asyncHandler } = require('./utils')


/* GET home page. */
router.get('/', asyncHandler(async (req, res,) => {
  let currentlyReadingUsers = [];
  let customBookshelfUsers = [];
  let userInfo, feed;
  if (req.session.auth) {
    userInfo = await User.findByPk(req.session.auth.userId, {
      attributes: { exclude : ['hashedPassword']},
      include: {
        model: Bookshelf,
        include: Story
      }
    })
    feed = await Placement.findAll({
      order: [['updatedAt', 'DESC']],
      include: [Story, {
        model: Bookshelf,
        include: {
          model: User,
          attributes: { exclude : ['hashedPassword']},
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
    feed
  });
  // res.json({ userInfo, feed })
}));

module.exports = router;
