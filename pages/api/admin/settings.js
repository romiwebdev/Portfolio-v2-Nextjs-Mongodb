// pages/api/admin/settings.js
import Admin from '../../../db/AdminModel';
import mongoose from 'mongoose';

export default withSessionAPI(async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { currentUsername } = req.session.admin;
    const { newUsername, currentPassword, newPassword } = req.body;

    // Temukan admin yang sedang login
    const admin = await Admin.findOne({ username: currentUsername });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Validasi password saat ini jika mengubah password atau username
    if ((newPassword || newUsername) && !admin.comparePassword(currentPassword)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update username jika ada perubahan
    if (newUsername && newUsername !== currentUsername) {
      // Cek apakah username baru sudah dipakai
      const existingAdmin = await Admin.findOne({ username: newUsername });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      admin.username = newUsername;
      req.session.admin.username = newUsername;
      await req.session.save();
    }

    // Update password jika ada perubahan
    if (newPassword) {
      admin.password = newPassword; // Note: Dalam produksi, password harus di-hash
    }

    await admin.save();

    return res.status(200).json({ 
      message: 'Settings updated successfully',
      username: admin.username
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});