import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Method untuk memverifikasi password (tanpa hashing)
adminSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;