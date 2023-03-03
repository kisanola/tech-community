import { Schema, model } from 'mongoose';

const pushSubscriberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  endpoint: String,
  keys: Schema.Types.Mixed,
  platform: {
    type: String,
    enum: ['mobile', 'web'],
    default: 'web',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default model('PushSubscriber', pushSubscriberSchema);
