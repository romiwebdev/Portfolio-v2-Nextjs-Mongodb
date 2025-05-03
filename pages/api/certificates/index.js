import dbConnect from '../../../db/connect';
import Certificate from '../../../db/CertificateModel';
import { verifyToken } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  // Verifikasi token untuk semua metode kecuali GET
  if (req.method !== 'GET') {
    try {
      await verifyToken(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  try {
    // GET all certificates
    if (req.method === 'GET') {
      const certificates = await Certificate.find()
        .sort({ issueDate: -1 }) // Urutkan dari tanggal terbaru
        .exec();
      return res.status(200).json(certificates);
    }

    // POST new certificate
    if (req.method === 'POST') {
      try {
        // Validasi manual sebelum menyimpan
        if (!req.body.image) {
          return res.status(400).json({
            message: 'Image is required',
            errors: { image: 'Please upload an image for the certificate' }
          });
        }

        // Validasi issueDate tidak boleh di masa depan
        if (new Date(req.body.issueDate) > new Date()) {
          return res.status(400).json({ 
            message: 'Issue date cannot be in the future' 
          });
        }

        const certificate = new Certificate(req.body);
        await certificate.save();
        return res.status(201).json(certificate);
      } catch (error) {
        if (error.name === 'ValidationError') {
          // Tangkap error validasi mongoose
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({
            message: 'Validation failed',
            errors
          });
        }
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}