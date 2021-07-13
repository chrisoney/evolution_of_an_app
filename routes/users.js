const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { asyncHandler, csrfProtection, pageChecker } = require('./utils');
const { loginUser, logoutUser } = require('../auth');
const { User } = require('../db/models')

const loginValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.get('/login', pageChecker, csrfProtection, (req, res, next) => {
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

  const user = User.build({ email, username });

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

router.post('/demo', asyncHandler( async (req, res, next) => {
  const user = await User.findOne({ where: { username: 'chris' } });
  loginUser(req, res, user);
  return req.session.save(err => {
    if (err) next(err);
    else return res.redirect('/');
  })
}))


router.post('/logout', pageChecker, (req, res, next) => {
  logoutUser(req, res);
  req.session.save(err => {
    if (err) {
      next(err)
    } else {
      res.redirect('/users/login')
    }
  })
})

module.exports = router;
