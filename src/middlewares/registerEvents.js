import 'dotenv/config';
import { EventEmitter } from 'events';
import PostCommentNotificationController from '../controllers/PostCommentNotificationController';
import { subscribe } from '../config/firebase-admin';
import AlgoliaController from '../controllers/AlgoliaController';

const { NODE_ENV } = process.env;

export const notifEvents = new EventEmitter();

const registerEvents = () => {
  if (NODE_ENV !== 'test') {
    notifEvents.on('create-index', AlgoliaController.createIndex);
    notifEvents.on('update-index', AlgoliaController.createIndex);
    notifEvents.on('delete-index', AlgoliaController.deleteIndex);

    notifEvents.on(
      'register-notification-token',
      ({ notificationToken, currentUser }) => {
        subscribe({ notificationToken, topic: currentUser._id });
      },
    );

    notifEvents.on(
      'post-commented',
      PostCommentNotificationController.postActions,
    );

    notifEvents.on('post-liked', PostCommentNotificationController.postActions);
  }
};

export default registerEvents;
