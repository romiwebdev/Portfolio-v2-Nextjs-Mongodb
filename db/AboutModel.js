import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  about_1: {
    type: String,
    required: true
  },
  what_i_love: {
    type: String,
    required: true
  },
  my_hobbies: {
    type: String,
    required: true
  },
  apps_i_use: {
    type: String,
    required: true
  },
  my_journey: {
    type: String,
    required: true
  },
  fun_fact: {
    type: String,
    required: true
  }
}, { timestamps: true });

const About = mongoose.models.About || mongoose.model('About', aboutSchema);

export default About;