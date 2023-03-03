import express from 'express';
import { celebrate } from 'celebrate';
import { RecommendationController } from '../../../controllers';
import { recommendationValidator } from './validators';
import { checkAuth, asyncHandler, userExist } from '../../../middlewares';

const router = express.Router();

router
  .route('/:username')
  .post(
    checkAuth,
    userExist,
    celebrate({ body: recommendationValidator.recommend }),
    asyncHandler(RecommendationController.createRecommendation),
  ).get(
    userExist,
    asyncHandler(RecommendationController.getRecommendation)
  );

router
  .route('/:recommendationId')
  .put(
    checkAuth,
    celebrate({ body: recommendationValidator.recommend }),
    asyncHandler(RecommendationController.updateRecommendation),
  )

router.route('/:recommendationId/approve')
  .post(
    checkAuth,
    asyncHandler(RecommendationController.approveRecommendation)
  ).delete(
    checkAuth,
    asyncHandler(RecommendationController.disapproveRecommendation)
  )

export default router;
