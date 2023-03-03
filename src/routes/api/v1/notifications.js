import express from 'express';
import { celebrate } from 'celebrate';
import UserNotificationController from '../../../controllers/UserNotificationController';
import { notificationValidator } from './validators';
import {
  checkAuth,
  asyncHandler,
  mobileDetector,
  checkUserNotification,
} from '../../../middlewares';

const router = express.Router();

router.get(
  '/',
  checkAuth,
  asyncHandler(UserNotificationController.getAllUserNotifications),
);

router.put(
  '/token',
  checkAuth,
  celebrate({
    body: notificationValidator.updateNotificationToken,
  }),
  mobileDetector,
  asyncHandler(UserNotificationController.updateNotificationToken),
);

router.put(
  '/:userNotificationId/read',
  checkAuth,
  asyncHandler(checkUserNotification),
  asyncHandler(UserNotificationController.readUserNotification),
);

router.delete(
  '/:userNotificationId',
  checkAuth,
  asyncHandler(checkUserNotification),
  asyncHandler(UserNotificationController.deleteUserNotification),
);

export default router;
