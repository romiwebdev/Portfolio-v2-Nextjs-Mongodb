import dbConnect from '../../../db/connect';
import Certificate from '../../../db/CertificateModel';
import { verifyToken } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  // Verifikasi token untuk semua metode
  try {
    await verifyToken(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    // GET single certificate
    if (req.method === 'GET') {
      const certificate = await Certificate.findOne({ id });
      if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
      return res.status(200).json(certificate);
    }
    
    // PUT update certificate
    if (req.method === 'PUT') {
      const certificate = await Certificate.findOneAndUpdate({ id }, req.body, { new: true });
      if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
      return res.status(200).json(certificate);
    }
    
    // DELETE certificate
    if (req.method === 'DELETE') {
      const certificate = await Certificate.findOneAndDelete({ id });
      if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
      return res.status(200).json({ message: 'Certificate deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}