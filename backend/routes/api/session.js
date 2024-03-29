// backend/routes/api/session.js
const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    //.notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];
// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;
    
    const user = await User.login({ credential, password });
    
    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
      // res.status(401)
      // console.log('backend response')
      // return res.json({
      //   "message": "Invalid credentials",
      //   "statusCode": 401
      // })
    }
  
    else {
    let token = await setTokenCookie(res, user);
    let newUser = user.toJSON()
    newUser.token = token;
    return res.json(newUser);
    }
  }
  );
  
  // Log out
  router.delete(
    '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);


// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json(
       user.toSafeObject()
      );
    } else return res.json({});
  }
);

module.exports = router;