const express = require('express');
const router = express.Router();
const faker = require('faker')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { asyncHandler, csrfProtection, pageChecker, addStories } = require('./utils');
const { loginUser, logoutUser, requireAuth } = require('../auth');
const { User, Bookshelf, Story, Placement, sequelize } = require('../db/models')

router.use(pageChecker)

const loginValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.get('/login', csrfProtection, (req, res, next) => {
  res.render('login', { token: req.csrfToken(), mode: 'auth-background' });
});

router.post('/login', csrfProtection, loginValidators, asyncHandler(async (req, res, next) => {
  const {
    username,
    password,
  } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    // Attempt to get the user by their email address.
    const user = await User.findOne({ where: { username } });
    if (user !== null) {
      // If the user exists then compare their password
      // to the provided password.
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if (passwordMatch) {
        // If the password hashes match, then login the user
        // and redirect them to the default route.
        loginUser(req, res, user);
        return req.session.save(err => {
          if (err) next(err);
          else return res.redirect('/');
        })
      }
    }

    // Otherwise display an error message to the user.
    errors.push('Login failed for the provided email address and password');
  } else {
    errors = validatorErrors.array().map((error) => error.msg);
  }

  res.render('login', {
    username,
    errors,
    csrfToken: req.csrfToken(),
  });

}))

router.get('/signup', csrfProtection, (req, res, next) => {
  const user = User.build()
  res.render('signup', { token: req.csrfToken(), user, mode: 'auth-background' });
});


const userValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username')
    .isLength({ max: 30 })
    .withMessage('Username must not be more than 30 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email')
    .custom((value) => {
      return User.findOne({ where: { email: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided Email Address is already in use by another account');
          }
        });
    }),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 50 })
    .withMessage('Confirm Password must not be more than 50 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match Password');
      }
      return true;
    }),
];

router.post('/signup', csrfProtection, userValidators, asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;

  const user = User.build({ email, username, demo: false });

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    loginUser(req, res, user);
    return req.session.save(err => {
      if (err) next(err)
      else return res.redirect('/');
    })
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('signup', {
      user,
      errors,
      token: req.csrfToken(),
    });
  }
}))

router.post('/demo', asyncHandler(async (req, res, next) => {
  // const user = await User.findOne({ where: { username: 'Main_Character' }});
  const user = await User.create({
    username: faker.name.findName(),
    email: faker.internet.email(),
    hashedPassword: bcrypt.hashSync('hunter12')
  });
  const choices = ['Read', 'Currently Reading', 'Want To Read']
  const bookshelves = [];
  for (let i = 0; i < choices.length; i++){
    const name = choices[i];
    const newShelf = await Bookshelf.create({ name, userId: user.id, deleteAllowed: false })
    bookshelves.push(newShelf)
  }
  const newEditShelf = await Bookshelf.create({ name: 'Favorites', userId: user.id, deleteAllowed: true })
  bookshelves.push(newEditShelf);
  
  
  await addStories(bookshelves, 5)

  loginUser(req, res, user);
  return req.session.save(err => {
    if (err) next(err);
    else return res.redirect('/');
  })
}))


router.post('/logout', asyncHandler(async(req, res, next) => {
  const user = await User.findByPk(req.session.auth.userId)
  await user.destroy();
  logoutUser(req, res);
  req.session.save(err => {
    if (err) {
      next(err)
    } else {
      res.redirect('/users/login')
    }
  })
}))

router.get('/:id(\\d+)/bookshelves', requireAuth, asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id, {
    attributes: { exclude: ['hashedPassword']},
    include: {
      model: Bookshelf,
      include: {
        model: Story,
        include: [Bookshelf, {
          model: Placement
        }],
      }
    }
  })
  const allStories = new Set();
  user.Bookshelves.forEach(bookshelf => {
    bookshelf.Stories.forEach(story => {
      allStories.add(story)
      allStories.add(story)
    })
  })
  const allArr = Array.from(allStories)
  const allCount = allArr.length;

  const loadedStories = allArr;
  res.render('bookshelf-page', { user, loadedStories, allCount })
  // res.json({ loadedStories })
}))

module.exports = router;
