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
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload ke Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'portfolio/certificates',
      resource_type: 'image'
    });

    return res.status(200).json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: 'Error uploading image',
      error: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb' // Sesuaikan dengan kebutuhan
    }
  }
};