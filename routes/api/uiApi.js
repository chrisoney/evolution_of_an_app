var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/color', function (req, res, next) {
  const { color } = req.body
  req.session.ui = {mode: color};
  res.json({color})
});
router.post('/stage', function (req, res, next) {
  const { stage } = req.body
  req.session.ui = { mode: stage };
  res.json({success: 'success'})
});

module.exports = router;