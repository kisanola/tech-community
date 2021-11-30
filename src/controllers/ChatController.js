import { Chat } from '../models';
import { statusCodes } from '../constants';
import notifier from '../helpers/notifier';

/**
 * Handles chat controllers
 *
 * @export
 * @class ChatController
 */
export default class ChatController {

    /**
     * Sends a message to the receiver
     * 
     * @author Grace Lungu
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {object} chat
     * @memberof ChatController
     */
    static async send(req, res) {
        const { body } = req.body;
        const { currentUser } = req;

        const { id } = req.receiver;

        const chat = await Chat.create({
            body,
            sender: currentUser.id,
            receiver: id,
        });

        notifier({ event: currentUser.username, payload: chat, io: req.app.io })

        return res.status(statusCodes.OK).json({
            status: statusCodes.OK,
            chat,
        });

    }

    /**
     * Gets the current user
     * chats
     *
     * @author Grace Lungu
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {array} chats
     * @memberof ChatController
     */
    static async getUserChats(req, res) {
        const { id } = req.receiver;

        const chats = await Chat.find().or([{ sender: id }, { receiver: id }]);

        return res.status(statusCodes.OK).json({
            status: statusCodes.OK,
            chats,
        });

    }

}
