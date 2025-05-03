import dbConnect from '../../../db/connect';
import Project from '../../../db/ProjectModel';
import { verifyToken } from '../../../middleware/authMiddleware';

export default async function handler(req, res) {
  await dbConnect();

  try {
    await verifyToken(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { projects } = req.body;

  if (!projects || !Array.isArray(projects)) {
    return res.status(400).json({ message: 'Invalid projects data' });
  }

  try {
    const session = await Project.startSession();
    session.startTransaction();
    
    const bulkOps = projects.map((projectId, index) => ({
      updateOne: {
        filter: { id: projectId },
        update: { $set: { order: index } }
      }
    }));

    await Project.bulkWrite(bulkOps, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}