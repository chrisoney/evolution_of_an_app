const express = require('express');
const router = express.Router();
const apiUiRouter = require('./uiApi');
const apiBookshelfRouter = require('./bookshelfApi')

router.use('/ui', apiUiRouter)
router.use('/bookshelves', apiBookshelfRouter)

module.exports = router;