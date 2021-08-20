const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils');
const { Review } = require('../../db/models')

router.post('/', asyncHandler(async (req, res) => {
  const { rating, content, storyId } = req.body;
  const userId = req.session.auth.userId;
  let review = await Review.findOne({
    where: {
      userId,
      storyId
    }
  })
  console.log(review)
  if (review) {
    if (content) review.content = content;
    if (rating) review.rating = rating;
    await review.save();
  } else {
    review = await Review.create({
      userId,
      storyId,
      rating,
      content
    })
  }
  res.json({ review })

}))

module.exports = router;