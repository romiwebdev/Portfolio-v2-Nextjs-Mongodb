import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Validasi base64 image
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'portfolio/skills',
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
      sizeLimit: '10mb' // Meningkatkan limit untuk file besar
    }
  }
};