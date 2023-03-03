import express from 'express';
import { FollowController } from '../../../controllers';
import { checkAuth, asyncHandler, checkUsername } from '../../../middlewares';

const router = express.Router();

router
  .route('/:username')
  .all(asyncHandler(checkAuth))
  .all(asyncHandler(checkUsername))
  .post(asyncHandler(FollowController.follow))
  .delete(asyncHandler(FollowController.unFollow));

export default router;
