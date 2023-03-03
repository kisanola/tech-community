import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const postCommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
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

postCommentSchema.plugin(mongoosePaginate);

export default model('PostComment', postCommentSchema);
