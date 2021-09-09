const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cron = require('node-cron')
const moment = require('moment')
const logger = require('morgan');
const { sequelize, User, Bookshelf, Placement, Story, Review } = require('./db/models');
const { Op } = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const bookshelvesRouter = require('./routes/bookshelves');
const storiesRouter = require('./routes/stories');
const apiRouter = require('./routes/api')

const { restoreUser, requireAuth } = require('./auth');
const { pageChecker, asyncHandler } = require('./routes/utils');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000
});

app.use(
  session({
    secret: 'superSecret',
    store,
    saveUninitialized: false,
    resave: false,
  })
);

// create Session table if it doesn't already exist
store.sync();

cron.schedule('0 0 12 * * *', async () => {
  try {
    // Old users
    const users = await User.findAll({
      where: {
        createdAt: {
          [Op.lte]: moment().subtract(1, 'day').toDate()
        },
        demo: true
      }
    })
    for (let i = 0; i < users.length; i++){
      await users[i].destroy()
    }
    // Bringing random placements to the forefront of the social feed
    const random = await Placement.findAll({
      order: sequelize.random(),
      limit: 10,
    })
    for (let i = 0; i < random.length; i++){
      const placement = random[i]
      placement.changed('updatedAt', true)
      await placement.save();
    }
  } catch(err) {
    console.error(err)
  }
})
app.use((req, res, next) => {
  if (process.env.NODE_ENV != 'development' && !req.secure) {
     return res.redirect("https://" + req.headers.host + req.url);
  }

  next();
})

// app.get('/testing', asyncHandler(async (req, res) => {
//   const stories = await Story.findAll({
//     where: {
//       [i]: {
//         [Op.iLike]: '%healer%'
//       }
//     }
//   })
//   res.json({ stories })
// }))

// Sample routes for teaching students how the nesting works

// app.get('/example', asyncHandler(async (req, res) => {
//   const user = await Story.findByPk(3, {
//     include:
//     {
//       model: Review,
//       include: {
//         attributes: ['hashedPassword'],
//         model: User
//       }
//     },
//     // User
//   })
//   res.json({ user })
// }))

app.use(restoreUser)
// Dark Magicks
// app.get('/update-placements', asyncHandler(async (req, res, next) => {
//   if (req.session.auth.userId !== 17) next();
//   const placementsBefore = await Placement.findAll({
//     include: Story,
//     order: [['updatedAt', 'DESC']],
//     limit: 5,
//   })
//   const random = await Placement.findAll({
//     order: sequelize.random(),
//     limit: 10,
//   })
//   for (let i = 0; i < random.length; i++){
//     const placement = random[i]
//     placement.changed('updatedAt', true)
//     await placement.save();
//   }
//   const placementsAfter = await Placement.findAll({
//     include: Story,
//     order: [['updatedAt', 'DESC']],
//     limit: 5,
//   })
//   res.json({ placementsBefore, placementsAfter })
// }))

app.use('/api', apiRouter)
app.use(pageChecker)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(requireAuth)
app.use('/bookshelves', bookshelvesRouter);
app.use('/stories', storiesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('page-not-found')
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
