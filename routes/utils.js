const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const authPages = ['/users/login', '/users/signup']
const bookShelfPages = [/users\/\d+\/bookshelves/,/bookshelves\/edit/]

const pageChecker = (req, res, next) => {
  const url = req.originalUrl;
  console.log('hit')
  if (parseInt(res.locals.mode) < 2) {
    for (let i = 0; i < bookShelfPages.length; i++){
      const regex = bookShelfPages[i];
      if (regex.exec(url)) return res.render('page-not-made')
    }
  }
  if (authPages.includes(url) && res.locals.mode === '0') {
    res.render('page-not-made')
  }
  else if (req.method === 'POST' && res.locals.mode === '0') {
    res.render('page-not-made', {alert: 'alert("This version of the app didn\'t have this functionality. Switch to a newer version to see it")</script>'})
  }
  else {
    next()
  }
}

module.exports = {
  csrfProtection,
  asyncHandler,
  pageChecker
};