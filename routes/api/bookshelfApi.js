const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils');
const { Bookshelf } = require('../../db/models');


router.get('/', asyncHandler(async (req, res) => {
  const userId = req.session.auth.userId;
  const bookshelves = await Bookshelf.findAll({
    where: {
      userId,
      deleteAllowed: false
    }
  })
  const data = {};
  bookshelves.forEach(bookshelf => {
    data[bookshelf.name] = bookshelf.id;
  })
  res.json(data)
}))

router.post('/', asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.session.auth.userId;
  const bookshelf = await Bookshelf.create({ name, userId })
  
  res.json({ bookshelf })
}))

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const bookshelf = await Bookshelf.findByPk(id, {
    include: Story
  });
  res.json({ bookshelf })
}))

router.put('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const bookshelf = await Bookshelf.findByPk(id);
  await bookshelf.update({ name });
  res.json( { bookshelf })
}))

router.delete('/:id(\\d+)', asyncHandler(async(req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookshelf = await Bookshelf.findByPk(id);
  await bookshelf.destroy()

  res.json({ success: 'success' })
}))

module.exports = router;