import express from 'express';
import { OrganizationController } from '../../../controllers';
import {
    asyncHandler,
    checkOrganization
} from '../../../middlewares';

const router = express.Router();

router
    .route('/').get(asyncHandler(OrganizationController.getAll));

router
    .route('/:organizationId').get(checkOrganization, asyncHandler(OrganizationController.get));

export default router;
