const express = require('express');
const { asyncHandler, pageChecker } = require('./utils');
const { Story } = require('../db/models')
const router = express.Router();

router.use(pageChecker)

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const story = await Story.findByPk(id);

  res.render('story-page', { story })
  // res.json({ story })
}))



module.exports = router;