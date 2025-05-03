import mongoose from 'mongoose';

const homeSchema = new mongoose.Schema({
  photo: {
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  },
  tagline: {
    type: String,
    required: true
  },
  tagline2: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  status: {
    type: [String],
    required: true
  },
  socials: [{
    name: String,
    link: String
  }],
  resumelink: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Home = mongoose.models.Home || mongoose.model('Home', homeSchema);

export default Home;