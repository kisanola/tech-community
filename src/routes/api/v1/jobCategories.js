import express from 'express';
import { celebrate } from 'celebrate';
import { JobCategoryController } from '../../../controllers';
import { jobCategoryValidator } from './validators';
import {
  checkAuth,
  checkRoles,
  asyncHandler,
  checkJobCategory,
  checkJobCategoryExist,
} from '../../../middlewares';

const router = express.Router();

router
  .route('/categories')
  .post(
    checkAuth,
    checkRoles(['admin']),
    celebrate({ body: jobCategoryValidator.createJobCategory }),
    checkJobCategoryExist,
    asyncHandler(JobCategoryController.createJobCategory),
  )
  .get(asyncHandler(JobCategoryController.getJobAllCategories));

router
  .route('/categories/:jobCategorySlug')
  .get(checkJobCategory, asyncHandler(JobCategoryController.getJobCategory))
  .put(
    checkAuth,
    checkRoles(['admin']),
    celebrate({ body: jobCategoryValidator.updateJobCategory }),
    checkJobCategory,
    asyncHandler(JobCategoryController.updateJobCategory),
  )
  .delete(
    checkAuth,
    checkRoles(['admin']),
    checkJobCategory,
    asyncHandler(JobCategoryController.deleteJobCategory),
  );

export default router;
