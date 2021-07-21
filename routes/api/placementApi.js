const express = require('express')
const router = express.Router();
const { Placement } = require('../../db/models');
const { asyncHandler } = require('../utils');

router.post('/', asyncHandler(async (req, res) => {
  const { bookshelfId, storyId } = req.body
  const placement = await Placement.create({
    bookshelfId,
    storyId
  })

  res.json( { placement })
}))

module.exports = router;