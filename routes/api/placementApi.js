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
  let placement = await Placement.findOne({
    where: {
      bookshelfId,
      storyId
    }
  });
  if (placement) {
    await placement.destroy();
  }
  else {
    placement = await Placement.create({
      bookshelfId,
      storyId
    })
  }

  res.json( { placement, bookshelf })
}))

router.delete('/', asyncHandler(async (req, res) => {
  const { storyId } = req.body;
  const userId = req.session.auth.userId;
  const bookshelves = await Bookshelf.findAll({
    where: { userId },
    include: {
      model: Story,
      where: { id: storyId }
    }
  })
  for (let i = 0; i < bookshelves.length; i++){
    const bookshelf = bookshelves[i];
    const placement = await Placement.findOne({
      where: {
        bookshelfId: bookshelf.id,
        storyId
      }
    })
    if (placement) await placement.destroy();
  }

  res.json({ success: 'success' })
}))

module.exports = router;