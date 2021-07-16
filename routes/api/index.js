const express = require('express');
const router = express.Router();
const uiRouter = require('./uiApi')

router.use('/ui', uiRouter)

module.exports = router;