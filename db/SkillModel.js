import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['proficient', 'comfortable', 'other']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);

export default Skill;