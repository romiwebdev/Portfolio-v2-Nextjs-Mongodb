import dbConnect from '../../../db/connect'; // Perbaikan path
import Project from '../../../db/ProjectModel';
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
    // GET single project
    if (req.method === 'GET') {
      const project = await Project.findOne({ id });
      if (!project) return res.status(404).json({ message: 'Project not found' });
      return res.status(200).json(project);
    }
    
    // PUT update project
    if (req.method === 'PUT') {
      const project = await Project.findOneAndUpdate({ id }, req.body, { 
        new: true,
        runValidators: true // Pastikan validasi dijalankan saat update
      });
      if (!project) return res.status(404).json({ message: 'Project not found' });
      return res.status(200).json(project);
    }
    
    // DELETE project
    if (req.method === 'DELETE') {
      const project = await Project.findOneAndDelete({ id });
      if (!project) return res.status(404).json({ message: 'Project not found' });
      return res.status(200).json({ message: 'Project deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message // Tambahkan pesan error spesifik
    });
  }
}