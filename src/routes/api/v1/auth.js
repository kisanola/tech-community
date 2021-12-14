import express from 'express';
import { celebrate } from 'celebrate';
import dotenv from 'dotenv';
import passport from '../../../config/passport';
import AuthController, { walletSignup, walletLogin } from '../../../controllers/AuthController';
import { authValidator } from './validators';
import { asyncHandler, checkUser, verifyToken } from '../../../middlewares';

dotenv.config();
const router = express.Router();

const getCallbackURL = (plaform, fallbackUrl) =>
  `${process.env.DOMAIN}/api/v1/auth/${plaform}/redirect?fallback=${
    fallbackUrl || ''
  }`;

router.route('/google').get((req, res, next) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    callbackURL: getCallbackURL('google', req.query.url),
  })(req, res, next);
});

router
  .route('/google/redirect')
  .get(
    passport.authenticate('google'),
    asyncHandler(AuthController.socialAuth),
  );

router.route('/facebook').get((req, res, next) => {
  passport.authenticate('facebook', {
    callbackURL: getCallbackURL('facebook', req.query.url),
  })(req, res, next);
});

router
  .route('/facebook/redirect')
  .get(
    passport.authenticate('facebook', { scope: ['email'] }),
    asyncHandler(AuthController.socialAuth),
  );

router.route('/github').get((req, res, next) => {
  passport.authenticate('github', {
    callbackURL: getCallbackURL('github', req.query.url),
  })(req, res, next);
});

router
  .route('/github/redirect')
  .get(
    passport.authenticate('github'),
    asyncHandler(AuthController.socialAuth),
  );

router
  .route('/signup/wallet')
  .post(
    celebrate({ body: authValidator.publicAddress }),
    asyncHandler(walletSignup),
  );

router
  .route('/login/wallet')
  .post(
    celebrate({ body: authValidator.walletLogin }),
    asyncHandler(walletLogin),
  );

  router
  .route('/signup')
  .post(
    checkUser,
    celebrate({ body: authValidator.signup }),
    asyncHandler(AuthController.signup),
  );

router
  .route('/login')
  .post(
    celebrate({ body: authValidator.login }),
    asyncHandler(AuthController.login),
  );

router
  .route('/verification/:token')
  .get(verifyToken, asyncHandler(AuthController.verification));

export default router;
