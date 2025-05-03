import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../../../middleware/authMiddleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default async function handler(req, res) {
  // Verifikasi token
  try {
    await verifyToken(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload PDF ke Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'portfolio/resume',
      resource_type: 'auto'
    });

    return res.status(200).json({
      url: uploadResponse.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Error uploading resume' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};