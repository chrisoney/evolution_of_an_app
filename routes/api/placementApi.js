const express = require('express')
const router = express.Router();
const { Placement, Bookshelf, Story } = require('../../db/models');
const { asyncHandler } = require('../utils');

router.post('/', asyncHandler(async (req, res) => {
  const { bookshelfId, storyId } = req.body
  const bookshelf = await Bookshelf.findByPk(bookshelfId);
  if (!bookshelf.deleteAllowed) {
    const bookshelves = await Bookshelf.findAll({
      where: {
        userId: req.session.auth.userId,
        deleteAllowed: false
      },
      include: Story
    })
    for (let i = 0; i < bookshelves.length; i++) {
      const shelf = bookshelves[i];
      const storyIds = shelf.Stories.map(story => story.id);
      if (storyIds.includes((parseInt(storyId, 10)))) {
        await Placement.destroy({
          where: {
            bookshelfId: shelf.id,
            storyId
          }
        })
      }
    }
  }
  const placement = await Placement.create({
    bookshelfId,
    storyId
  })

  res.json( { placement, bookshelf })
}))

module.exports = router;