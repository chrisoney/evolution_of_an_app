const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils');
const { Bookshelf } = require('../../db/models');


router.post('/', asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.session.auth.userId;
  const bookshelf = await Bookshelf.create({ name, userId })
  
  res.json({ bookshelf })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const bookshelf = await Bookshelf.findByPk(id, {
    include: Story
  });
  res.json({ bookshelf })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const bookshelf = await Bookshelf.findByPk(id);
  await bookshelf.update({ name });
  res.json( { bookshelf })
}))

router.delete('/:id', asyncHandler(async(req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookshelf = await Bookshelf.findByPk(id);
  await bookshelf.destroy()

  res.json({ success: 'success' })
}))

module.exports = router;