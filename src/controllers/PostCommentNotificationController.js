import UserNotificationController from './UserNotificationController';
import * as notifMessages from '../constants/notificationMessage';
import { sendNotification } from '../config/firebase-admin';
/**
 * @description UserNotification Controller class
 */
export default class PostCommentNotificationController {
  /**
   * @author Olivier
   * @param {Object} data
   * @param {*} next
   * @returns {Object} Returns record's data
   */
  static async postActions({ post, action = 'commented', token, currentUser }) {
    const link = `/posts/${post.slug}`;
    const content = notifMessages.notifyOwner({
      username: currentUser.username,
      action,
      resource: 'post',
      text: post.title,
    });

    const data = {
      user: post.author._id,
      email: post.author.email,
      content,
      link,
    };

    sendNotification({
      token: token.notificationToken,
      topic: `${post.author._id}`,
      notification: {
        title: post.title,
        body: content,
      },
      data: {
        link,
      },
    });

    UserNotificationController.createUserNotification(data);
    return data;
  }
}
