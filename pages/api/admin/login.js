import Admin from '../../../db/AdminModel';
import dbConnect from '../../../db/connect';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { username, password } = req.body;

  try {
    // Cari admin
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verifikasi password (tanpa hashing)
    const isMatch = admin.password === password;
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Set cookie
    res.setHeader('Set-Cookie', serialize('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 jam
      sameSite: 'strict',
      path: '/',
    }));

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}