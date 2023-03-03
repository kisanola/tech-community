import admin from 'firebase-admin';
import 'dotenv/config';
import serviceAccount from './firebaseServiceAccount';
import logger from '../helpers/logger';

const { APP_NAME, APP_LOGO, FIREBASE_DATABASE_URL } = process.env;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_DATABASE_URL,
});

const defaultNotification = {
  title: APP_NAME,
  icon: APP_LOGO,
};

export const sendNotification = message => {
  message.notification = {
    ...defaultNotification,
    ...message.notification,
  };

  return admin
    .messaging()
    .send(message)
    .then(res => {
      logger.info(`Successfully sent message: ${res}`);
      return res;
    })
    .catch(error => {
      logger.error(`Error sending message: ${error.message}`);
      return error;
    });
};

export const subscribe = async ({ topic, notificationToken }) => {
  if (!notificationToken) return;
  return admin
    .messaging()
    .subscribeToTopic(notificationToken, topic)
    .then(res => {
      logger.info(`Successfully subscribed to topic: ${res}`);
      return res;
    })
    .catch(error => {
      logger.error(`Error subscribing to topic: ${error}`);
    });
};

export default admin;
