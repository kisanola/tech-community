import { Schema, model } from 'mongoose';

const ShareSchema = new Schema({
  plateforme: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
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

export default model('Share', ShareSchema);
