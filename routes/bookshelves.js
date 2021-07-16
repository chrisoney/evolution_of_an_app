const express = require('express');
const router = express.Router();
const { Bookshelf } = require('../db/models');

router.get('/edit', asyncHandler(async (req, res) => {
  const bookshelves = await Bookshelf.findAll()
}))

module.exports = router;