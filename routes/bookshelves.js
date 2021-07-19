const express = require('express');
const router = express.Router();
const { Bookshelf, Story, Sequelize } = require('../db/models');
const { asyncHandler, pageChecker } = require('./utils');

router.use(pageChecker)
router.get('/edit', asyncHandler(async (req, res) => {
  const userId = req.session.auth.userId;
  const bookshelves = await Bookshelf.findAll({
    where: { userId },
    order: [['id', 'ASC']],
    include: Story,
  })
  
  res.render('bookshelf-edit', { bookshelves })
  // res.json({bookshelves})
}))

module.exports = router;