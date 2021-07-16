const express = require('express');
const router = express.Router();
const { Bookshelf } = require('../db/models');
const { asyncHandler } = require('./utils');

router.get('/edit', asyncHandler(async (req, res) => {
  const userId = req.session.auth.userId;
  const bookshelves = await Bookshelf.findAll({ where: { userId } })
  
  res.render('bookshelf-edit', { bookshelves })
}))

module.exports = router;