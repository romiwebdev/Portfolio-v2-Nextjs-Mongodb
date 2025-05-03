import jwt from 'jsonwebtoken';

export const verifyToken = (handler) => async (req, res) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    return handler(req, res);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};