const express = require('express');
const router = express.Router();
const apiUiRouter = require('./uiApi');
const apiBookshelfRouter = require('./bookshelfApi')
const apiPlacementRouter = require('./placementApi')

router.use('/ui', apiUiRouter)
router.use('/bookshelves', apiBookshelfRouter)
router.use('/placements', apiPlacementRouter)

module.exports = router;