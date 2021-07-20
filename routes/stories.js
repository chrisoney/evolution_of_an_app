const express = require('express');
const { asyncHandler } = require('./utils');
const router = express.Router();

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const story = await Story.findByPk(id);

  res.render('story-page', { story })
}))



module.exports = router;