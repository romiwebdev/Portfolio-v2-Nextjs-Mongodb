import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../../../middleware/authMiddleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default async function handler(req, res) {
  // Verify token
  try {
    await verifyToken(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { image, type } = req.body;
    
    if (!image || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Configuration based on file type
    let uploadOptions = {
      folder: type === 'photo' ? 'portfolio/home' : 'portfolio/resumes',
    };

    if (type === 'photo') {
      uploadOptions.transformation = [
        { width: 500, height: 500, gravity: 'face', crop: 'thumb' },
        { radius: 'max' }
      ];
    } else if (type === 'resume') {
      uploadOptions.resource_type = 'raw';
      uploadOptions.type = 'upload';
      // Force download with specific filename
      uploadOptions.flags = `attachment:${encodeURIComponent('Fazle-Rabbi-Resume.pdf')}`;
    }

    const uploadResponse = await cloudinary.uploader.upload(image, uploadOptions);

    return res.status(200).json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      // For PDFs, include the download URL
      download_url: type === 'resume' 
        ? `${uploadResponse.secure_url}?dl=${Date.now()}-Fazle-Rabbi-Resume.pdf` 
        : uploadResponse.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Error uploading file' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};