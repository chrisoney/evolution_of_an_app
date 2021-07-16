const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils');
const { Bookshelf } = require('../../db/models');

router.post('/', asyncHandler(async (req, res) => {
  const { name, userId } = req.body;
  // const userId = req.session.auth.userId;
  const bookshelf = await Bookshelf.create({ name, userId })

  res.json({ bookshelf })
}))

module.exports = router;