import express from 'express';
import { celebrate } from 'celebrate';
import { FeedController } from '../../../controllers';
import { asyncHandler } from '../../../middlewares';
import feedValidator from './validators/feedValidator';

const router = express.Router();

router
  .route('/')
  .get(
    celebrate({ query: feedValidator.query }),
    asyncHandler(FeedController.getFeed),
  );

router
  .route('/organization')
  .get(
    celebrate({ query: feedValidator.query }),
    asyncHandler(FeedController.getOrganizations),
  );

export default router;
