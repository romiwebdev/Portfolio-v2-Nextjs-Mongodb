import Visitors from '@/db/VisitorModel';
import dbConnect from '@/db/connect';
import { verifyToken } from '@/middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  // Verifikasi token admin
  try {
    await verifyToken(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Hitung total dokumen
    const total = await Visitors.countDocuments();

    // Ambil data dengan pagination
    const visitors = await Visitors.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      visitors,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ message: 'Server error' });
  }
}