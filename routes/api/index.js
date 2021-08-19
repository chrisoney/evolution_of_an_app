const express = require('express');
const router = express.Router();
const apiUiRouter = require('./uiApi');
const apiBookshelfRouter = require('./bookshelfApi')
const apiPlacementRouter = require('./placementApi')
const apiReviewRouter = require('./reviewApi')

router.use('/ui', apiUiRouter)
router.use('/bookshelves', apiBookshelfRouter)
router.use('/placements', apiPlacementRouter)
router.use('/reviews', apiReviewRouter)

module.exports = router;