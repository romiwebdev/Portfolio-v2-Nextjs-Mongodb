import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.status(200).json({ message: 'Authenticated' });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}