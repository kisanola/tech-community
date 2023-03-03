import { Schema, model } from 'mongoose';

const LikeSchema = new Schema({
    post: { type: Schema.Types.ObjectId },
    user: { type: Schema.Types.ObjectId },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});


export default model('Like', LikeSchema);
