import dbConnect from '../../../db/connect';
import Project from '../../../db/ProjectModel';
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
    // GET all projects
    if (req.method === 'GET') {
      const projects = await Project.find().sort({ order: 1 }); // Urutkan berdasarkan order
      return res.status(200).json(projects);
    }
    
    // POST new project
    if (req.method === 'POST') {
      // Cari order tertinggi saat ini
      const lastProject = await Project.findOne().sort({ order: -1 });
      const newOrder = lastProject ? lastProject.order + 1 : 0;
      
      const project = new Project({
        ...req.body,
        order: newOrder // Set order baru
      });
      
      await project.save();
      return res.status(201).json(project);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}