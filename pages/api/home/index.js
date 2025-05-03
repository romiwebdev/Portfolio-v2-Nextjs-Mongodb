import dbConnect from '../../../db/connect';
import Home from '../../../db/HomeModel';
import { verifyToken } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  // GET - Tidak perlu auth
  // pages/api/home/index.js
if (req.method === 'GET') {
  try {
    const homeData = await Home.findOne().sort({ createdAt: -1 });
    
    // Return default structure if no data found
    const responseData = homeData || {
      photo: { url: '', alt: 'Fazle Rabbi' },
      tagline: '',
      tagline2: '',
      intro: '',
      status: ['', '', ''],
      socials: [
        { name: 'instagram', link: '' },
        { name: 'linkedin', link: '' },
        { name: 'github', link: '' }
      ],
      resumelink: ''
    };
    
    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

  // PUT - Perlu auth
  if (req.method === 'PUT') {
    try {
      await verifyToken(req, res);
      
      // Cek apakah sudah ada data home
      const existingHome = await Home.findOne();
      
      let homeData;
      if (existingHome) {
        // Update data yang ada
        homeData = await Home.findOneAndUpdate({}, req.body, { new: true });
      } else {
        // Buat baru jika belum ada
        homeData = new Home(req.body);
        await homeData.save();
      }
      
      return res.status(200).json(homeData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}