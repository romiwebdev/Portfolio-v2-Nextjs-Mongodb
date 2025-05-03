import dbConnect from '../../../db/connect';
import About from '../../../db/AboutModel';
import { verifyToken } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  // GET - Tidak perlu auth
  if (req.method === 'GET') {
    try {
      const aboutData = await About.findOne().sort({ createdAt: -1 });
      return res.status(200).json(aboutData || {});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // PUT - Perlu auth
  if (req.method === 'PUT') {
    try {
      await verifyToken(req, res);
      
      // Validasi data sebelum menyimpan
      if (!req.body.profileImage) {
        return res.status(400).json({ message: 'Profile image is required' });
      }
      if (!req.body.name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      
      // Cek apakah sudah ada data about
      const existingAbout = await About.findOne();
      
      let aboutData;
      if (existingAbout) {
        // Update data yang ada
        aboutData = await About.findOneAndUpdate({}, req.body, { new: true });
      } else {
        // Buat baru jika belum ada
        aboutData = new About(req.body);
        await aboutData.save();
      }
      
      return res.status(200).json(aboutData);
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: error.errors 
        });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}