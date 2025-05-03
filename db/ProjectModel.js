import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'fullstack', 'misc']
  },
  cover: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  technologies: [{
    name: String,
    style: String
  }],
  links: {
    github: String,
    live: String
  },
  details: {
    title: String,
    desc: String,
    features: [String]
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  },
  order: {
    type: Number,
    default: 0,
    index: true
  }
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;