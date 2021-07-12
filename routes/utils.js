const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const authPages = ['/users/login']

const pageChecker = (req, res, next) => {
  const url = req.originalUrl;
  if (authPages.includes(url) && res.locals.mode === '0') {
    res.render('page-not-made')
  } else {
    next()
  }
}

module.exports = {
  csrfProtection,
  asyncHandler,
  pageChecker
};