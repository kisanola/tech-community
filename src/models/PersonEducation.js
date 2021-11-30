import mongoose, { Schema } from 'mongoose';

const personEducationSchema = new Schema({
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
  },
  institution: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model('PersonEducation', personEducationSchema);
