import mongoose, { Schema } from 'mongoose';

const personSchema = new Schema({
  providerId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  middleName: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  birthDate: {
    type: Date,
  },
  nationality: {
    type: String,
  },
  bio: {
    type: String,
    default: '',
  },
  languages: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  educations: [{ type: Schema.Types.ObjectId, ref: 'PersonEducation' }],
  experiences: [{ type: Schema.Types.ObjectId, ref: 'PersonExperience' }],
});

export default mongoose.model('Person', personSchema);
