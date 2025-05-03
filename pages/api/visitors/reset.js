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

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Hapus semua data visitor
    const result = await Visitors.deleteMany({});
    
    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} visitor records`
    });
  } catch (error) {
    console.error('Error resetting visitor data:', error);
    res.status(500).json({ message: 'Server error' });
  }
}