import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: {
    type: String,
  },
  status: {
    type: String,
    default: 'active',
  },
  signoutAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  notificationToken: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

export default model('Token', TokenSchema);
