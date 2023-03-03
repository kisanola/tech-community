import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const userNotification = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  link: {
    type: String
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

userNotification.plugin(mongoosePaginate);

export default model('UserNotification', userNotification);
