import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true,
  },
  credentialLink: {
    type: String
  },
  description: {
    type: String
  },
  tags: [{
    type: String
  }],
}, { timestamps: true });

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

export default Certificate;