import { Schema, model } from 'mongoose';

const followSchema = new Schema({
  followed: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default model('Follow', followSchema);
