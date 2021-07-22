const express = require('express');
const router = express.Router();
const { User, Bookshelf, Story, sequelize } = require('../db/models');
const { asyncHandler } = require('./utils')


/* GET home page. */
router.get('/', asyncHandler(async(req, res,) => {
  const currentlyReadingUsers = await User.findAll({
    attributes: { exclude : ['hashedPassword']},
    include: {
      model: Bookshelf,
      where: { name: 'Currently Reading' },
      include: Story
    },
    order: sequelize.random(),
    limit: 2
  })
  const customBookshelfUsers = await User.findAll({
    attributes: { exclude : ['hashedPassword']},
    include: {
      model: Bookshelf,
      where: { deleteAllowed: true },
      include: Story
    },
    order: sequelize.random(),
    limit: 2
  })
  res.render('index', {
    title: 'a/A Express Skeleton Home',
    currentlyReadingUsers,
    customBookshelfUsers,
  });
  // res.json({ currentlyReadingUsers, customBookshelfUsers })
}));

module.exports = router;
