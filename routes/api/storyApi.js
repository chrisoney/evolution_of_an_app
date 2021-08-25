const express = require('express');
const router = express.Router();
const { Placement, Bookshelf, Story, Tag } = require('../../db/models');
const { Op } = require('sequelize');
const { asyncHandler } = require('../utils');

router.post('/', asyncHandler(async (req, res) => {
  const { tags } = req.body
  let stories = await Story.findAll({
    order: [['title']],
  });
  const tagQuery = await Tag.findAll({
    where: {
      name: {
        [Op.in]: tags
      }
    },
    include: Story
  })
  if (tagQuery.length > 0) {
    for (let i = 0; i < tagQuery.length; i++) {
      const tag = tagQuery[i];
      const tempStories = []
      for (let j = 0; j < tag.Stories.length; j++){
        const story = tag.Stories[j];
        if (stories.map(story => story.title).includes(story.title)) {
          tempStories.push(story);
        }
      }
      stories = tempStories;
    }
  }
  
  res.json({ stories })
}))


module.exports = router;