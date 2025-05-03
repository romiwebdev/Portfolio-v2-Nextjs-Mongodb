import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../../../middleware/authMiddleware';

// Konfigurasi Cloudinary
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
    // Validasi data yang diterima
    if (!req.body.image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Ekstrak base64 dari data URL jika perlu
    let imageData = req.body.image;
    if (imageData.startsWith('data:')) {
      imageData = imageData.split(',')[1];
    }

    // Upload ke Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageData}`, {
      folder: 'portfolio/projects',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }]
    });

    // Validasi response dari Cloudinary
    if (!uploadResponse.secure_url) {
      throw new Error('Invalid response from Cloudinary');
    }

    return res.status(200).json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({ 
      message: 'Error uploading image',
      error: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Meningkatkan limit untuk gambar besar
    }
  }
};